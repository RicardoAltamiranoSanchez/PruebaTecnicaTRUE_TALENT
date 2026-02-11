from fastapi import APIRouter, Depends, HTTPException
import httpx
from pydantic import BaseModel
from app.core.auth import get_current_user

router = APIRouter()

class RpaRequest(BaseModel):
    search_term: str

@router.post("/trigger")
async def trigger_rpa(request: RpaRequest, current_user: dict = Depends(get_current_user)):
    """
    Triggers the RPA process.
    Requires authentication.
    """
    try:
        async with httpx.AsyncClient() as client:
            # Call the internal RPA service
            response = await client.post(
                "http://rpa:8001/run",
                json={"search_term": request.search_term},
                timeout=60.0  # Increased timeout for RPA process
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"RPA Service Error: {str(e)}")
