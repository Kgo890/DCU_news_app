from typing import List, Dict
import requests
from backend.app.db.mongo import posts_collection

HEADERS = {"User-Agent": "dcu-news-app-bot/0.1"}


def reddit_scrape(subreddit: str, sort: str = "hot", limit: int = 10, time_filter: str = "day") -> List[Dict]:
    url = f"https://www.reddit.com/r/{subreddit}/{sort}.json"
    params = {
        "limit": 25,
        "t": time_filter if sort == "top" else None
    }

    after = None
    collected_posts = []

    while len(collected_posts) < limit:
        if after:
            params["after"] = after

        response = requests.get(url, headers=HEADERS, params=params)
        if response.status_code != 200:
            raise Exception(f"Reddit API request failed with status {response.status_code}")

        data = response.json().get("data", {})
        posts = data.get("children", [])
        after = data.get("after")

        if not posts:
            break

        for post in posts:
            p = post["data"]
            if p.get("stickied"):
                continue

            permalink = f"https://reddit.com{p.get('permalink')}"
            if posts_collection.find_one({"link": permalink}):
                continue

            video_url = None
            audio_url = None
            has_audio = False
            is_reddit_video = bool(video_url)
            image_url = None

            # Check for Reddit-hosted video
            if "media" in p and p["media"]:
                reddit_video = p["media"].get("reddit_video")
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

            # Fallback to image
            if not video_url:
                if "preview" in p:
                    try:
                        image_url = p["preview"]["images"][0]["source"]["url"]
                        if image_url:
                            image_url = image_url.replace("&amp;", "&")
                    except (KeyError, IndexError):
                        pass

                if not image_url and p.get("url", "").lower().endswith((".jpg", ".jpeg", ".png", ".gif")):
                    image_url = p["url"]

                if not image_url and p.get("thumbnail", "").startswith("http"):
                    image_url = p["thumbnail"]

            collected_posts.append({
                "title": p.get("title"),
                "author": p.get("author"),
                "link": permalink,
                "created_utc": p.get("created_utc"),
                "subreddit": p.get("subreddit"),
                "score": p.get("score"),
                "num_comments": p.get("num_comments"),
                "post_id": p.get("id"),
                "tags": [],
                "type": "Reddit",
                "image_url": image_url,
                "video_url": video_url,
                "audio_url": audio_url,
                "has_audio": has_audio,
                "is_reddit_video": is_reddit_video,
            })

            if len(collected_posts) >= limit:
                break

        if not after:
            break

    return collected_posts
