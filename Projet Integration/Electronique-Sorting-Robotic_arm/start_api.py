import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from script import start_sorting  # Importez votre fonction de tri

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autorise toutes les origines
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Liste pour stocker les connexions WebSocket actives
active_connections: list[WebSocket] = []

@app.websocket("/ws/start-sorting")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    
    try:
        # Fonction de tri personnalisée qui envoie les mises à jour via WebSocket
        def custom_sorting_callback(sorted_item):
            # Convertir l'élément trié en JSON si nécessaire
            asyncio.create_task(broadcast_message(str(sorted_item)))
        
        # Lancez le tri avec le callback personnalisé
        start_sorting(callback=custom_sorting_callback)
    
    except WebSocketDisconnect:
        active_connections.remove(websocket)

async def broadcast_message(message: str):
    for connection in active_connections:
        try:
            await connection.send_text(message)
        except Exception as e:
            print(f"Erreur d'envoi du message : {e}")
            active_connections.remove(connection)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)