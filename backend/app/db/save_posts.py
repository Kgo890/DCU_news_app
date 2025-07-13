from backend.app.db.mongo import posts_collection
from datetime import datetime, UTC
from typing import List, Dict


def save_reddit_posts(posts: List[Dict], subreddit: str) -> List[Dict]:
    inserted_posts = []
    for post in posts:
        post.update({
            "subreddit": subreddit,
            "scraped_at": datetime.now(UTC)
        })

        result = posts_collection.insert_one(post)
        post["_id"] = str(result.inserted_id)
        inserted_posts.append(post)

    return inserted_posts
