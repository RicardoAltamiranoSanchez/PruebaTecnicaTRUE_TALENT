from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.config import settings
import redis.asyncio as redis
import asyncio

router = APIRouter()

@router.websocket("/stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    r = redis.from_url(settings.REDIS_URL, decode_responses=True)
    pubsub = r.pubsub()
    await pubsub.subscribe("transaction_events")
    
    try:
        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True)
            if message:
                await websocket.send_text(message["data"])
            await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        print("Client disconnected")
    finally:
        await pubsub.unsubscribe()
        await r.close()
