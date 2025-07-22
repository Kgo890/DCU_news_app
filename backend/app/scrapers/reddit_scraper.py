import asyncpraw
import os
from typing import List, Dict
from dotenv import load_dotenv
from backend.app.db.mongo import posts_collection

load_dotenv()

REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
REDDIT_USER_AGENT = os.getenv("REDDIT_USER_AGENT")


async def reddit_scrape(
        subreddit: str,
        sort: str = "hot",
        limit: int = 10,
        time_filter: str = "day"
) -> List[Dict]:
    reddit = asyncpraw.Reddit(
        client_id=REDDIT_CLIENT_ID,
        client_secret=REDDIT_CLIENT_SECRET,
        user_agent=REDDIT_USER_AGENT
    )

    subreddit_obj = await reddit.subreddit(subreddit)

    if sort == "new":
        submissions = subreddit_obj.new(limit=limit)
    elif sort == "top":
        submissions = subreddit_obj.top(limit=limit, time_filter=time_filter)
    else:
        submissions = subreddit_obj.hot(limit=limit)

    collected_posts = []
    async for p in submissions:
        if p.stickied:
            continue

        if posts_collection.find_one({"link": f"https://reddit.com{p.permalink}"}):
            continue

        video_url = None
        audio_url = None
        has_audio = False
        is_reddit_video = False
        image_url = None

        # Handle media
        if hasattr(p, "media") and p.media:
            reddit_video = p.media.get("reddit_video") if isinstance(p.media, dict) else None
            if reddit_video:
                video_url = reddit_video.get("fallback_url")
                has_audio = reddit_video.get("has_audio", False)
                is_reddit_video = True
                if video_url and has_audio:
                    try:
                        base_url = video_url.split("/DASH_")[0]
                        audio_url = f"{base_url}/DASH_audio.mp4"
                    except Exception:
                        audio_url = None

        if not video_url:
            if hasattr(p, "preview") and p.preview:
                try:
                    image_url = p.preview["images"][0]["source"]["url"].replace("&amp;", "&")
                except (KeyError, IndexError):
                    pass
            if not image_url and p.url.lower().endswith((".jpg", ".jpeg", ".png", ".gif")):
                image_url = p.url
            if not image_url and p.thumbnail.startswith("http"):
                image_url = p.thumbnail

        collected_posts.append({
            "title": p.title,
            "author": p.author.name if p.author else None,
            "link": f"https://reddit.com{p.permalink}",
            "created_utc": p.created_utc,
            "subreddit": p.subreddit.display_name,
            "score": p.score,
            "num_comments": p.num_comments,
            "post_id": p.id,
            "tags": [],
            "type": "Reddit",
            "image_url": image_url,
            "video_url": video_url,
            "audio_url": audio_url,
            "has_audio": has_audio,
            "is_reddit_video": is_reddit_video,
        })

    await reddit.close()
    return collected_posts
