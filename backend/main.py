import asyncio
import sys

if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.reddit_routes import router as reddit_router
from backend.app.auth.auth_routes import router as auth_router

app = FastAPI(title="DCU Reddit News API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reddit_router)
app.include_router(auth_router)


@app.get("/")
async def root():
    return {"message": "DCU Reddit News App is running!"}
