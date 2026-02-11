from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from system_bot import run_system_rpa
import os

app = FastAPI(title="RPA Service")

class RpaRequest(BaseModel):
    search_term: str = "Artificial Intelligence"

@app.get("/")
def health_check():
    return {"status": "ok", "service": "rpa-api"}

@app.post("/run")
def trigger_rpa(request: RpaRequest):
    """
    Triggers the RPA bot to interact with the System.
    """
    result = run_system_rpa(request.search_term)
    
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
        
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
