import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from script import start_sorting
import threading
import queue

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router for additional endpoints
router = APIRouter()

@router.post("/start-sorting")
async def start_sorting_endpoint():
    """Endpoint to trigger sorting process"""
    print("Sorting process start requested")
    return {"status": "Sorting started"}

# Include the router in the main app
app.include_router(router)

@app.websocket("/ws/start-sorting")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connection established")

    # Create a thread-safe queue for messages
    message_queue = queue.Queue()

    # Create a stop event for controlling the sorting process
    stop_event = threading.Event()

    try:
        # Define a callback to put messages in the queue
        def websocket_callback(message):
            print(f"Received message to send: {message}")
            message_queue.put(message)

        # Start sorting in a separate thread
        def run_sorting():
            print("Starting sorting process in thread")
            try:
                start_sorting(
                    websocket_callback=websocket_callback, 
                    stop_event=stop_event
                )
            except Exception as e:
                print(f"Error in sorting thread: {e}")
                stop_event.set()

        # Start the sorting thread
        sorting_thread = threading.Thread(target=run_sorting)
        sorting_thread.start()

        # Send messages from the queue
        while not stop_event.is_set():
            try:
                # Try to get a message with a timeout
                message = message_queue.get(timeout=1)
                print(f"Sending WebSocket message: {message}")
                await websocket.send_text(str(message))
                message_queue.task_done()
            except queue.Empty:
                # No message in queue, continue checking
                continue
            except Exception as e:
                print(f"WebSocket sending error: {e}")
                break

    except WebSocketDisconnect:
        print("WebSocket disconnected")
    finally:
        # Ensure everything stops
        stop_event.set()
        # Wait for sorting thread to finish
        sorting_thread.join()
        print("Sorting process terminated")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)