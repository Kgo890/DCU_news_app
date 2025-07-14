from fastapi import HTTPException

from fastapi import APIRouter
from backend.app.db.save_posts import *
from backend.app.scrapers.reddit_scraper import scrape_subreddit
from backend.app.utils.verified_subreddit import VERIFIED_SUBREDDIT
router = APIRouter(prefix="/reddit", tags=["Reddit"])


@router.post("/scrape")
async def scrape(subreddit: str = "DC_Cinematic", max_posts: int = 3, tag: str = "NEWS"):
    if not is_verified_subreddit(subreddit):
        raise HTTPException(
            status_code=403,
            detail=f"The account '{subreddit}' is not verified. Check /reddit/verified_subreddits for the list."
        )
    posts = scrape_subreddit(subreddit, max_posts)
    saved = save_reddit_posts(posts, subreddit, tag)
    return saved


@router.get("/posts")
async def get_all_posts():
    return fetch_all_posts()


@router.get("/posts_by_subreddit")
async def getting_posts_by_subreddit(subreddit: str):
    if not is_verified_subreddit(subreddit):
        raise HTTPException(
            status_code=403,
            detail=f"The account '{subreddit}' is not verified. Check /reddit/verified_subreddits for the list."
        )
    return get_posts_by_subreddit(subreddit)


@router.get("/posts_by_date_range")
async def getting_posts_by_date(from_date: str, to_date: str):
    return get_posts_by_date_range(from_date, to_date)

@router.get("/posts_by_keyword")
async def getting_posts_by_keyword(keyword: str):
    return get_posts_by_keyword(keyword)


@router.get("/timeline")
async def getting_daily_top_posts():
    return get_daily_top_posts()


@router.get("/verified_subreddits")
async def get_verified_subreddits():
    return {"verified_subreddits": VERIFIED_SUBREDDIT}


@router.delete("/delete_post_by_id")
async def deleting_post_by_id(post_id: str):
    return delete_post_by_id(post_id)


@router.delete("/delete_all_post")
async def deleting_all_post():
    return delete_all_posts()
