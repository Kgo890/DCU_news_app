from fastapi import APIRouter, Query
from backend.app.db.save_posts import *
from backend.app.scrapers.reddit_scraper import reddit_scrape
from backend.app.utils.verified_subreddit import VERIFIED_SUBREDDIT

router = APIRouter(prefix="/reddit", tags=["Reddit"])


@router.post("/scrape")
async def scrape_subreddit(
        subreddit: str = Query(...),
        max_posts: int = Query(10),
        sort: str = Query("hot"),
        time_filter: str = Query("day")
):
    if not is_verified_subreddit(subreddit):
        raise HTTPException(status_code=403, detail=f"Subreddit '{subreddit}' is not verified.")

    try:
        posts = reddit_scrape(subreddit=subreddit, sort=sort, limit=max_posts, time_filter=time_filter)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reddit scrape failed: {str(e)}")

    saved_posts = save_reddit_posts(posts, subreddit)

    return {"message": f"Success: {len(saved_posts)} posts saved", "data": saved_posts}


@router.get("/posts")
async def get_all_posts():
    return fetch_all_posts()


@router.get("/posts-by-subreddit")
async def getting_posts_by_subreddit(subreddit: str):
    if not is_verified_subreddit(subreddit):
        raise HTTPException(
            status_code=403,
            detail=f"The account '{subreddit}' is not verified. Check /reddit/verified_subreddits for the list."
        )
    return get_posts_by_subreddit(subreddit)


@router.get("/posts-by-date-range")
async def getting_posts_by_date(from_date: str, to_date: str):
    return get_posts_by_date_range(from_date, to_date)


@router.get("/posts-by-keyword")
async def getting_posts_by_keyword(keyword: str):
    posts = get_posts_by_keyword(keyword)
    return {"posts": posts}


@router.get("/timeline")
async def getting_daily_top_posts():
    results = get_daily_top_posts()
    return {"message": results}


@router.get("/verified-subreddits")
async def get_verified_subreddits():
    return {"verified_subreddits": VERIFIED_SUBREDDIT}


@router.delete("/delete-post-by-id")
async def deleting_post_by_id(post_id: str = Query(...)):
    return delete_post_by_id(post_id)


@router.delete("/delete-all-post")
async def deleting_all_post():
    return delete_all_posts()
