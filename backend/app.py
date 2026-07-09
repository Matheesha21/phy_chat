from fastapi import FastAPI
from fastapi.responses import JSONResponse

from core.postgres import check_postgres_health
from core.redis import check_redis_health

app = FastAPI(
    title="Physics Chatbot API",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "message": "Physics chatbot backend running"
    }


@app.get("/health")
def health():
    postgres_health = check_postgres_health()
    redis_health = check_redis_health()
    is_healthy = postgres_health["status"] == "healthy" and redis_health["status"] == "healthy"

    payload = {
        "status": "healthy" if is_healthy else "unhealthy",
        "backend": {"status": "healthy"},
        "postgres": postgres_health,
        "redis": redis_health,
    }

    if is_healthy:
        return payload

    return JSONResponse(status_code=503, content=payload)
