from fastapi import FastAPI
from backend.app.api.reddit_routes import router as reddit_router
from backend.app.auth.auth_routes import router as auth_router

app = FastAPI(title="DCU Reddit News API")

app.include_router(reddit_router)
app.include_router(auth_router)


@app.get("/")
async def root():
    return {"message": "DCU Reddit News App is running!"}
