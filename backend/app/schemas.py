from pydantic import BaseModel, UUID4, Field
from decimal import Decimal
from typing import Optional
from datetime import datetime

class TransactionCreate(BaseModel):
    user_id: UUID4
    monto: Decimal = Field(..., gt=0)
    tipo: str
    idempotency_key: str

class TransactionResponse(BaseModel):
    id: UUID4
    user_id: UUID4
    monto: Decimal
    tipo: str
    status: str
    created_at: datetime
    processed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PaginatedTransactionResponse(BaseModel):
    items: list[TransactionResponse]
    total: int
    page: int
    size: int
    pages: int

class AsyncProcessRequest(BaseModel):
    user_id: UUID4
    monto: Decimal
    tipo: str
