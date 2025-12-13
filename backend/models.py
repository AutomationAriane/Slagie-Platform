from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, Table
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

# ==================== USER & AUTH MODELS ====================

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
    created_exams = relationship("Exam", back_populates="creator", foreign_keys="Exam.created_by")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"


# ==================== PRACTICE QUESTIONS (Topic System) ====================

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
    """Practice vraag (voor oefen-modus)"""
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    question_number = Column(Integer, nullable=False)
    subtopic_id = Column(Integer, ForeignKey("subtopics.id"), nullable=False)
    text = Column(Text, nullable=False)
    question_type = Column(String(50), nullable=True)
    image_url = Column(String(255), nullable=True)
    theme = Column(String(255), nullable=True)
    
    # Relaties
    subtopic = relationship("SubTopic", back_populates="questions")
    answer_options = relationship("AnswerOption", back_populates="question", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Question(id={self.id}, number={self.question_number}, text={self.text[:50]}...)>"


class AnswerOption(Base):
    """Antwoordoptie voor practice vragen (A, B, C, D)"""
    __tablename__ = "answer_options"
    
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    option_letter = Column(String(1), nullable=False)
    text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    
    # Relaties
    question = relationship("Question", back_populates="answer_options")
    
    def __repr__(self):
        return f"<AnswerOption(id={self.id}, option={self.option_letter}, correct={self.is_correct})>"


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
    exam = relationship("Topic")

    def __repr__(self):
        return f"<QuizAttempt(id={self.id}, user={self.user_id}, score={self.score}/{self.total_questions})>"


# ==================== EXAM SYSTEM (Admin-Created Exams) ====================

# Many-to-Many association table
exam_questions_association = Table(
    'exam_questions_link',
    Base.metadata,
    Column('exam_id', Integer, ForeignKey('exams.id'), primary_key=True),
    Column('question_id', Integer, ForeignKey('exam_question_items.id'), primary_key=True),
    Column('order', Integer, default=0)
)


class Exam(Base):
    """Admin-created exams with publish/draft functionality"""
    __tablename__ = "exams"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    cover_image = Column(String(500))
    
    # Exam settings
    time_limit = Column(Integer)  # Minutes
    passing_score = Column(Integer)  # Percentage (e.g., 86)
    category = Column(String(100))  # "Theorie", "Gevaarherkenning", etc.
    
    # Publish/Draft status
    is_published = Column(Boolean, default=False, nullable=False)
    
    # Metadata
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime(timezone=True))
    
    # Relationships
    questions = relationship(
        "ExamQuestionItem",
        secondary=exam_questions_association,
        back_populates="exams"
    )
    creator = relationship("User", back_populates="created_exams", foreign_keys=[created_by])
    
    def __repr__(self):
        status = "Published" if self.is_published else "Draft"
        return f"<Exam(id={self.id}, title={self.title}, status={status})>"


class ExamQuestionItem(Base):
    """Questions belonging to admin-created exams"""
    __tablename__ = "exam_question_items"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Question content
    question_text = Column(Text, nullable=False)
    question_image = Column(String(500))  # Optional image URL
    question_type = Column(String(50), default="multiple_choice")
    
    # Relationships
    exams = relationship(
        "Exam",
        secondary=exam_questions_association,
        back_populates="questions"
    )
    answers = relationship("ExamAnswerOption", back_populates="question", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<ExamQuestionItem(id={self.id}, text={self.question_text[:30]}...)>"


class ExamAnswerOption(Base):
    """Answer options for exam questions"""
    __tablename__ = "exam_answer_options"
    
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("exam_question_items.id"), nullable=False)
    
    answer_text = Column(String(500), nullable=False)
    is_correct = Column(Boolean, default=False, nullable=False)
    order = Column(Integer, default=0)  # Order of answer (0=A, 1=B, 2=C, 3=D)
    
    # Relationship
    question = relationship("ExamQuestionItem", back_populates="answers")
    
    def __repr__(self):
        status = "✓" if self.is_correct else "✗"
        return f"<ExamAnswerOption(id={self.id}, text={self.answer_text[:20]}... {status})>"
