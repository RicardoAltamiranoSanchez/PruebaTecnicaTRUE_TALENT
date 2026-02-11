from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import transactions, assistant, websocket, auth, rpa
from app.core.database import engine, Base
from app.models.assistant import AssistantLog # Force import for table creation

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Transaction System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
app.include_router(assistant.router, prefix="/assistant", tags=["Assistant"])
app.include_router(websocket.router, prefix="/transactions", tags=["WebSocket"])
app.include_router(rpa.router, prefix="/rpa", tags=["RPA"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
