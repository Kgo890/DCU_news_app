from fastapi import APIRouter, HTTPException
from backend.app.scrapers.reddit_scraper import scrape_subreddit
from backend.app.db.save_posts import save_reddit_posts

router = APIRouter(prefix="/reddit", tags=["Reddit"])


@router.get("/scrape")
def scrape(subreddit: str, max_posts: int = 10):
    try:
        posts = scrape_subreddit(subreddit, max_posts)
        inserted = save_reddit_posts(posts, subreddit)
        return {"subreddit": subreddit, "posts": inserted}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
