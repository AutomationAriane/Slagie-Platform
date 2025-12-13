"""
Database Models for Slagie Platform
Clean, simple SQLAlchemy models with SQLite
"""
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()


class Exam(Base):
    """Exam entity - groups of 50 questions"""
    __tablename__ = "exams"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Relationships
    questions = relationship("Question", back_populates="exam", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Exam(id={self.id}, title='{self.title}')>"


class Question(Base):
    """Question entity"""
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"), nullable=False)
    text = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=True)
    question_type = Column(String(50), nullable=True)
    question_number = Column(Integer, nullable=False)  # Original number from Excel
    
    # Relationships
    exam = relationship("Exam", back_populates="questions")
    options = relationship("AnswerOption", back_populates="question", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Question(id={self.id}, exam_id={self.exam_id}, number={self.question_number})>"


class AnswerOption(Base):
    """Answer option for a question"""
    __tablename__ = "answer_options"
    
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    label = Column(String(1), nullable=False)  # A, B, C, D
    text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    
    # Relationships
    question = relationship("Question", back_populates="options")
    
    def __repr__(self):
        return f"<AnswerOption(id={self.id}, label='{self.label}', correct={self.is_correct})>"


class UserExamResult(Base):
    """Store user exam attempt results"""
    __tablename__ = "user_exam_results"
    
    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"), nullable=False)
    score = Column(Integer, nullable=False)  # Number of correct answers
    total = Column(Integer, nullable=False)  # Total questions
    passed = Column(Boolean, nullable=False)  # Whether user passed
    timestamp = Column(String(50), nullable=False)  # ISO timestamp
    
    # Relationships
    exam = relationship("Exam")
    
    def __repr__(self):
        return f"<UserExamResult(exam_id={self.exam_id}, score={self.score}/{self.total}, passed={self.passed})>"

