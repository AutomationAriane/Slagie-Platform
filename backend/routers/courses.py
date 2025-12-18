from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database import get_db
from models import User, Course, CourseModule, CourseLesson
from dependencies import get_current_user

router = APIRouter(tags=["courses"])

# ==================== SCHEMAS ====================
from pydantic import BaseModel

# --- Lessons ---
class LessonCreate(BaseModel):
    title: str
    content: Optional[str] = None
    video_url: Optional[str] = None
    duration_minutes: Optional[int] = 0
    order: Optional[int] = 0

class LessonUpdate(BaseModel):
    id: Optional[int] = None
    title: str
    content: Optional[str] = None
    video_url: Optional[str] = None
    duration_minutes: Optional[int] = 0
    order: Optional[int] = 0

class LessonResponse(BaseModel):
    id: int
    title: str
    content: Optional[str]
    video_url: Optional[str]
    duration_minutes: int
    order: int
    
    class Config:
        from_attributes = True

# --- Modules ---
class ModuleCreate(BaseModel):
    title: str
    order: Optional[int] = 0
    lessons: List[LessonCreate] = []

class ModuleUpdate(BaseModel):
    id: Optional[int] = None
    title: str
    order: Optional[int] = 0
    lessons: List[LessonUpdate] = []

class ModuleResponse(BaseModel):
    id: int
    title: str
    order: int
    lessons: List[LessonResponse] = []
    
    class Config:
        from_attributes = True

# --- Courses ---
class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    cover_image: Optional[str] = None
    is_published: bool = False
    modules: List[ModuleCreate] = []

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None
    is_published: Optional[bool] = None
    modules: Optional[List[ModuleUpdate]] = None

class CourseListResponse(BaseModel):
    # Lighter response for lists
    id: int
    title: str
    description: Optional[str]
    cover_image: Optional[str]
    is_published: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class CourseDetailResponse(CourseListResponse):
    modules: List[ModuleResponse] = []


# ==================== ENDPOINTS ====================

@router.post("", response_model=CourseDetailResponse, status_code=status.HTTP_201_CREATED)
def create_course(
    course_data: CourseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new course with modules and lessons (Admin Only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create courses")
    
    # Create Course
    new_course = Course(
        title=course_data.title,
        description=course_data.description,
        cover_image=course_data.cover_image,
        is_published=course_data.is_published
    )
    db.add(new_course)
    db.flush() # Get ID
    
    # Create Modules & Lessons
    for m_data in course_data.modules:
        new_module = CourseModule(
            course_id=new_course.id,
            title=m_data.title,
            order=m_data.order
        )
        db.add(new_module)
        db.flush() # Get ID
        
        for l_data in m_data.lessons:
            new_lesson = CourseLesson(
                module_id=new_module.id,
                title=l_data.title,
                content=l_data.content,
                video_url=l_data.video_url,
                duration_minutes=l_data.duration_minutes,
                order=l_data.order
            )
            db.add(new_lesson)
            
    db.commit()
    db.refresh(new_course)
    return new_course

@router.get("", response_model=List[CourseListResponse])
def list_courses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)  
):
    """List all courses (Admin: all, Student: published only)"""
    if current_user.role == "admin":
        return db.query(Course).order_by(Course.created_at.desc()).all()
    else:
        return db.query(Course).filter(Course.is_published == True).order_by(Course.created_at.desc()).all()

@router.get("/{course_id}", response_model=CourseDetailResponse)
def get_course(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get full course details"""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    if not course.is_published and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Course not available")
        
    return course

@router.put("/{course_id}", response_model=CourseDetailResponse)
def update_course(
    course_id: int,
    course_data: CourseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update course, modules, and lessons (Admin Only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update courses")
        
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Update Course Fields
    update_data = course_data.dict(exclude_unset=True)
    simple_fields = ["title", "description", "cover_image", "is_published"]
    for field in simple_fields:
        if field in update_data:
            setattr(course, field, update_data[field])
            
    # Handle Nested Hierarchy if provided
    if course_data.modules is not None:
        # Existing modules map
        existing_modules = {m.id: m for m in course.modules}
        submitted_mod_ids = [m.id for m in course_data.modules if m.id is not None]
        
        # Delete removed modules
        for m_id, mod in existing_modules.items():
            if m_id not in submitted_mod_ids:
                db.delete(mod)
                
        # Update/Create Modules
        for m_data in course_data.modules:
            if m_data.id and m_data.id in existing_modules:
                # Update Module
                mod = existing_modules[m_data.id]
                mod.title = m_data.title
                mod.order = m_data.order
                
                # Handle Lessons
                existing_lessons = {l.id: l for l in mod.lessons}
                submitted_lesson_ids = [l.id for l in m_data.lessons if l.id is not None]
                
                for l_id, lesson in existing_lessons.items():
                    if l_id not in submitted_lesson_ids:
                        db.delete(lesson)
                        
                for l_data in m_data.lessons:
                    if l_data.id and l_data.id in existing_lessons:
                        # Update Lesson
                        l = existing_lessons[l_data.id]
                        l.title = l_data.title
                        l.content = l_data.content
                        l.video_url = l_data.video_url
                        l.duration_minutes = l_data.duration_minutes
                        l.order = l_data.order
                    else:
                        # Create Lesson in existing Module
                        new_lesson = CourseLesson(
                            module_id=mod.id,
                            title=l_data.title,
                            content=l_data.content,
                            video_url=l_data.video_url,
                            duration_minutes=l_data.duration_minutes,
                            order=l_data.order
                        )
                        db.add(new_lesson)
            else:
                 # Create New Module
                new_mod = CourseModule(
                    course_id=course.id,
                    title=m_data.title,
                    order=m_data.order
                )
                db.add(new_mod)
                db.flush()
                
                # Create Lessons in new Module
                for l_data in m_data.lessons:
                    new_lesson = CourseLesson(
                        module_id=new_mod.id,
                        title=l_data.title,
                        content=l_data.content,
                        video_url=l_data.video_url,
                        duration_minutes=l_data.duration_minutes,
                        order=l_data.order
                    )
                    db.add(new_lesson)
    
    db.commit()
    db.refresh(course)
    return course

@router.delete("/{course_id}", status_code=204)
def delete_course(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete courses")
        
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    db.delete(course)
    db.commit()
    return None
