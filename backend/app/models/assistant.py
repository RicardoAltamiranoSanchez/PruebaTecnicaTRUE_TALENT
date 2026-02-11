import uuid
from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
from datetime import datetime

class AssistantLog(Base):
    __tablename__ = "assistant_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    input_text = Column(Text, nullable=False)
    output_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
