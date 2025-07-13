from fastapi import FastAPI
from backend.app.api.reddit_routes import router as reddit_router

app = FastAPI(title="DCU Reddit News API")

app.include_router(reddit_router)


@app.get("/")
async def root():
    return {"message": "DCU Reddit News App is running!"}
