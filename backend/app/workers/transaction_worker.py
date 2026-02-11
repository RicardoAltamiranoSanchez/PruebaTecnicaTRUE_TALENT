import time
import json
import redis
from datetime import datetime
from app.core.config import settings
from app.core.database import SessionLocal
from app.models.transaction import Transaction

r = redis.from_url(settings.REDIS_URL, decode_responses=True)

def validate_transaction(tx):
    print(f"Validating transaction {tx.id}...")
    if tx.monto > 1000000:
        raise ValueError("Amount too high")
    return True

def process_payment(tx):
    print(f"Processing payment for {tx.id}...")
    time.sleep(2) # Simulate processing time
    return True

def update_status(db, tx_id, status):
    tx = db.query(Transaction).filter(Transaction.id == tx_id).first()
    if tx:
        tx.status = status
        tx.processed_at = datetime.utcnow()
        db.commit()
        db.refresh(tx)
    return tx

def notify_frontend(tx):
    if not tx: return
    print(f"Notifying frontend for {tx.id} status: {tx.status}")
    message = json.dumps({
        "type": "transaction_update",
        "data": {
            "transaction_id": str(tx.id),
            "status": tx.status,
            "updated_at": str(tx.processed_at)
        }
    })
    r.publish("transaction_events", message)

def process_job(job_data):
    db = SessionLocal()
    try:
        data = json.loads(job_data)
        tx_id = data["transaction_id"]
        
        tx = db.query(Transaction).filter(Transaction.id == tx_id).first()
        if not tx:
            print(f"Transaction {tx_id} not found")
            return

        # Implicit DAG Execution Flow
        try:
            # Step 1: Validation
            validate_transaction(tx)
            
            # Step 2: Processing
            process_payment(tx)
            
            # Step 3: Persistence
            tx = update_status(db, tx_id, "procesado")
            
            # Step 4: Notification
            notify_frontend(tx)
            
        except Exception as e:
            print(f"Error processing {tx_id}: {e}")
            tx = update_status(db, tx_id, "fallido")
            notify_frontend(tx)
            
    except Exception as e:
        print(f"Critical worker error: {e}")
    finally:
        db.close()

def start_worker():
    print("Worker started, waiting for jobs...")
    while True:
        try:
            # Blocking pop
            result = r.brpop("transaction_queue", timeout=5)
            if result:
                _, job = result
                process_job(job)
        except Exception as e:
            print(f"Connection error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    start_worker()
