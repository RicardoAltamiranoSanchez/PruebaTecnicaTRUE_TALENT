from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.auth import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
from app.core.decorators import log_execution

router = APIRouter()

@router.post("/login")
@log_execution(show_logs=True)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Hardcoded credentials check
    if form_data.username == "TRUE" and form_data.password == "TALENT":
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": form_data.username}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )
