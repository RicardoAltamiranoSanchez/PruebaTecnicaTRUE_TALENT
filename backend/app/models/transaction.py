import uuid
from sqlalchemy import Column, String, Numeric, DateTime, text
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
from datetime import datetime

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    monto = Column(Numeric(10, 2), nullable=False)
    tipo = Column(String, nullable=False)
    status = Column(String, default="pendiente")
    idempotency_key = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)

class TransactionLog(Base):
    __tablename__ = "transaction_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    transaction_id = Column(UUID(as_uuid=True), nullable=False)
    old_status = Column(String, nullable=True)
    new_status = Column(String, nullable=False)
    error_message = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
