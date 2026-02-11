from fastapi import APIRouter, Depends
from pydantic import BaseModel
import openai
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.decorators import log_execution
from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.assistant import AssistantLog

router = APIRouter()

class SummarizeRequest(BaseModel):
    text: str

@router.post("/summarize")
@log_execution(show_logs=True)
async def summarize(
    request: SummarizeRequest, 
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    summary = ""
    
    # 1. Generate Summary (Simulation or Real)
    if "placeholder" in settings.OPENAI_API_KEY or not settings.OPENAI_API_KEY:
        # Simulation Mode
        summary = f"Resumen simulado (IA no configurada): {request.text[:100]}..."
    else:
        # Real OpenAI Mode
        try:
            client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": f"Summarize this: {request.text}"}]
            )
            summary = response.choices[0].message.content
        except openai.RateLimitError:
            summary = f"Resumen simulado (Fallback - Cuota Excedida): {request.text[:100]}... (Nota: Tu API Key de OpenAI se quedó sin créditos, así que simulamos la respuesta para que la prueba continúe)."
        except openai.AuthenticationError:
            summary = f"Resumen simulado (Fallback - API Key Inválida): {request.text[:100]}..."
        except Exception as e:
            summary = f"Error OpenAI: {str(e)}"

    # 2. Log to Database
    try:
        new_log = AssistantLog(
            input_text=request.text,
            output_text=summary
        )
        db.add(new_log)
        db.commit()
        db.refresh(new_log)
    except Exception as e:
        print(f"Error guardando log: {e}")
      
    return {"summary": summary}
