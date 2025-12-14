from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class Topic(Base):
    """CBR Thema (Categorie van vragen)"""
    __tablename__ = "topics"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    
    # Relaties
    subtopics = relationship("SubTopic", back_populates="topic", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Topic(id={self.id}, name={self.name})>"


class SubTopic(Base):
    """Onderwerp (Sub-categorie binnen een Thema)"""
    __tablename__ = "subtopics"
    
    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Relaties
    topic = relationship("Topic", back_populates="subtopics")
    questions = relationship("Question", back_populates="subtopic", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<SubTopic(id={self.id}, name={self.name}, topic_id={self.topic_id})>"


class Question(Base):
    """Examen vraag"""
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    question_number = Column(Integer, nullable=False)  # Vraagnummer uit Excel
    subtopic_id = Column(Integer, ForeignKey("subtopics.id"), nullable=False)
    text = Column(Text, nullable=False)  # Vraagtekst
    question_type = Column(String(50), nullable=True)  # Vraagtype
    image_url = Column(String(255), nullable=True)  # Full image URL
    theme = Column(String(255), nullable=True)  # CBR Thema (bv. "Voorrang", "Milieu")
    
    # Relaties
    subtopic = relationship("SubTopic", back_populates="questions")
    answer_options = relationship("AnswerOption", back_populates="question", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Question(id={self.id}, number={self.question_number}, text={self.text[:50]}...)>"


class AnswerOption(Base):
    """Antwoordoptie (A, B, C, of D)"""
    __tablename__ = "answer_options"
    
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    option_letter = Column(String(1), nullable=False)  # A, B, C, D
    text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    
    # Relaties
    question = relationship("Question", back_populates="answer_options")
    
    
    def __repr__(self):
        return f"<AnswerOption(id={self.id}, option={self.option_letter}, correct={self.is_correct})>"


class User(Base):
    """Gebruiker (Admin of Student)"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="student")  # 'admin' or 'student'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relaties
    quiz_attempts = relationship("QuizAttempt", back_populates="user")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"


class QuizAttempt(Base):
    """Resultaat van een gemaakte quiz"""
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exam_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    passed = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relaties
    user = relationship("User", back_populates="quiz_attempts")
    exam = relationship("Topic")  # Unidirectional is fine for now

    def __repr__(self):
        return f"<QuizAttempt(id={self.id}, user={self.user_id}, score={self.score}/{self.total_questions})>"


# ==================== EXAM MANAGEMENT MODELS ====================

class Exam(Base):
    """Admin-created exams with publish/draft functionality"""
    __tablename__ = "exams"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    cover_image = Column(String(500))  # URL or file path
    
    # Exam settings
    time_limit = Column(Integer)  # Minutes
    passing_score = Column(Integer)  # Percentage (e.g., 86)
    category = Column(String(100))  # "Theorie", "Gevaarherkenning", etc.
    
    # CRITICAL: Publish/Draft status
    is_published = Column(Boolean, default=False, nullable=False)
    
    # Metadata
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime(timezone=True))
    
    # Relationships
    questions = relationship("ExamQuestion", back_populates="exam", cascade="all, delete-orphan")
    creator = relationship("User", foreign_keys=[created_by])
    
    def __repr__(self):
        status = "Published" if self.is_published else "Draft"
        return f"<Exam(id={self.id}, title={self.title}, status={status})>"


class ExamQuestion(Base):
    """Questions belonging to admin-created exams"""
    __tablename__ = "exam_questions"
    
    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"), nullable=False)
    
    # Question content
    question_text = Column(Text, nullable=False)
    question_image = Column(String(500))  # Optional image URL
    question_type = Column(String(50), default="multiple_choice")  # "multiple_choice", "true_false"
    order = Column(Integer, default=0)  # Order in exam
    
    # Relationships
    exam = relationship("Exam", back_populates="questions")
    answers = relationship("ExamAnswer", back_populates="question", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<ExamQuestion(id={self.id}, exam_id={self.exam_id}, text={self.question_text[:30]}...)>"


class ExamAnswer(Base):
    """Answer options for exam questions"""
    __tablename__ = "exam_answers"
    
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("exam_questions.id"), nullable=False)
    
    answer_text = Column(String(500), nullable=False)
    is_correct = Column(Boolean, default=False, nullable=False)
    order = Column(Integer, default=0)  # Order of answer (A, B, C, D)
    
    # Relationship
    question = relationship("ExamQuestion", back_populates="answers")
    
    def __repr__(self):
        status = "✓" if self.is_correct else "✗"
        return f"<ExamAnswer(id={self.id}, text={self.answer_text[:20]}... {status})>"
