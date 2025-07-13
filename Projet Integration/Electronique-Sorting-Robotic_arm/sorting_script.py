import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Importez vos fonctions existantes
from script import initialize,  script, stop #, detect_item

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

active_connections: list[WebSocket] = []

async def send_to_websocket(websocket, message):
    """
    Fonction utilitaire pour envoyer un message via WebSocket
    avec gestion des erreurs
    """
    try:
        await websocket.send_text(str(message))
    except Exception as e:
        print(f"Erreur d'envoi du message : {e}")
        if websocket in active_connections:
            active_connections.remove(websocket)

@app.websocket("/ws/start-sorting")
async def websocket_endpoint(websocket: WebSocket):
    """
    Point de terminaison WebSocket pour démarrer le tri
    """
    await websocket.accept()
    active_connections.append(websocket)
    
    try:
        # Appeler start_sorting avec le websocket
        start_sorting(websocket)
    except WebSocketDisconnect:
        active_connections.remove(websocket)
    finally:
        await websocket.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)