from fastapi import FastAPI

app = FastAPI(
    title="Physics Chatbot API",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "message": "Physics chatbot backend running"
    }
