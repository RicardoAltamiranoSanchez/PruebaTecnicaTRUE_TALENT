from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.transaction import Transaction
from app.schemas import TransactionCreate, TransactionResponse, AsyncProcessRequest, PaginatedTransactionResponse
from app.core.events import get_redis
from app.core.decorators import log_execution
from app.core.auth import get_current_user
import json
import uuid
import math

from typing import List

router = APIRouter()

@router.get("/", response_model=PaginatedTransactionResponse)
def list_transactions(page: int = 1, size: int = 10, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    skip = (page - 1) * size
    total = db.query(Transaction).count()
    transactions = db.query(Transaction).order_by(Transaction.created_at.desc()).offset(skip).limit(size).all()
    
    return {
        "items": transactions,
        "total": total,
        "page": page,
        "size": size,
        "pages": math.ceil(total / size)
    }

@router.post("/create", response_model=TransactionResponse)
@log_execution(show_logs=True)
def create_transaction(data: TransactionCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    # Idempotency check
    existing = db.query(Transaction).filter(Transaction.idempotency_key == data.idempotency_key).first()
    if existing:
        return existing

    new_tx = Transaction(**data.dict())
    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)
    return new_tx

@router.post("/async-process", response_model=TransactionResponse)
def async_process(data: AsyncProcessRequest, db: Session = Depends(get_db), redis=Depends(get_redis), current_user: str = Depends(get_current_user)):
    # Generate a fake idempotency key for this demo since it's not provided in the simple request
    idempotency_key = str(uuid.uuid4())
    
    tx = Transaction(
        user_id=data.user_id,
        monto=data.monto,
        tipo=data.tipo,
        status="pendiente",
        idempotency_key=idempotency_key
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)
    
    # Enqueue job
    job_data = {
        "transaction_id": str(tx.id),
        "user_id": str(tx.user_id),
        "amount": float(tx.monto)
    }
    redis.lpush("transaction_queue", json.dumps(job_data))
    
    return tx
