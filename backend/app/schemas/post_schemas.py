from pydantic import BaseModel


class RedditPost(BaseModel):
    title: str
    link: str
    subreddit: str
    scraped_at: str
