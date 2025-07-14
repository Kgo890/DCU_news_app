from bson import ObjectId
import datetime
from typing import List, Dict

from bson.errors import InvalidId

from backend.app.db.mongo import posts_collection
from backend.app.utils.verified_subreddit import VERIFIED_SUBREDDIT
from fastapi import HTTPException

UTC = datetime.timezone.utc


def serialize_post(post):
    return {
        "id": str(post["_id"]),
        "title": post["title"],
        "link": post["link"],
        "subreddit": post["subreddit"],
        "tag": post.get("tag", "General"),
        "scraped_at": post["scraped_at"].isoformat() if isinstance(post["scraped_at"], datetime.datetime) else str(
            post["scraped_at"])
    }


def save_reddit_posts(posts: List[Dict], subreddit: str, tag: str = "General") -> List[Dict]:
    inserted_posts = []
    for post in posts:
        if posts_collection.find_one({"link": post["link"]}):
            continue
        if not is_verified_subreddit(subreddit):
            raise HTTPException(
                status_code=403,
                detail=f"The account '{subreddit}' is not verified. Check /reddit/verified_accounts for the list."
            )
        post.update({
            "subreddit": subreddit,
            "scraped_at": datetime.datetime.now(UTC),
            "tag": post.get("tag", tag).strip().capitalize()
        })

        result = posts_collection.insert_one(post)
        post["_id"] = str(result.inserted_id)
        inserted_posts.append(post)

    return inserted_posts


def fetch_all_posts():
    results = []
    posts = posts_collection.find({})
    for post in posts:
        serialized_post = serialize_post(post)
        results.append(serialized_post)
    return results


def get_posts_by_subreddit(subreddit: str):
    results = []
    posts = list(posts_collection.find({"subreddit": subreddit}))
    if not posts:
        raise HTTPException(status_code=404, detail=f"{subreddit} was not found in your database.")

    for post in posts:
        serialized_post = serialize_post(post)
        results.append(serialized_post)

    return results


def get_posts_by_date_range(start_date: str, end_date: str):
    results = []
    try:
        start = datetime.datetime.fromisoformat(start_date)
        end = datetime.datetime.fromisoformat(end_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use ISO format like '2025-07-01T00:00:00'")

    query = {
        "scraped_at": {
            "$gte": start,
            "$lte": end
        }
    }

    posts = list(posts_collection.find(query))
    if not posts:
        raise HTTPException(status_code=404, detail="No posts found in the given date range.")

    for post in posts:
        serialized_post = serialize_post(post)
        results.append(serialized_post)

    return results


def get_posts_by_keyword(keyword: str):
    results = []
    query = {"title": {"$regex": keyword, "$options": "i"}}
    posts = list(posts_collection.find(query))
    if not posts:
        raise HTTPException(status_code=404, detail=f"{keyword} was not found in your database")

    for post in posts:
        serialized_post = serialize_post(post)
        results.append(serialized_post)

    return results


def get_daily_top_posts():
    results = []
    posts = posts_collection.find({}).sort("scraped_at", -1)
    grouped_by_date = {}
    for post in posts:
        scraped_at = post["scraped_at"]
        if isinstance(scraped_at, str):
            scraped_at = datetime.datetime.fromisoformat(scraped_at)

        date_str = scraped_at.date().isoformat()

        if date_str not in grouped_by_date:
            grouped_by_date[date_str] = []
        if len(grouped_by_date[date_str]) < 2:
            grouped_by_date[date_str].append(post)

    for post_list in grouped_by_date.values():
        for post in post_list:
            results.append(serialize_post(post))
    return results


def is_verified_subreddit(subreddit: str) -> bool:
    return subreddit in VERIFIED_SUBREDDIT


def delete_post_by_id(post_id: str):
    try:
        obj_id = ObjectId(post_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail=f"Invalid post ID format: {post_id}")

    result = posts_collection.delete_one({"_id": obj_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"The post with the ID {post_id} was not found in the database")

    return {"message": f"The post with the ID {post_id} has been deleted from the database"}


def delete_all_posts():
    results = posts_collection.delete_many({})
    return {"message": f"all the post in your database have now been deleted, in total {results.deleted_count} post(s)"}
