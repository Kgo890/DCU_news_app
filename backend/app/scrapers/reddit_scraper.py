import requests
from bs4 import BeautifulSoup
from datetime import datetime, UTC

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}


def scrape_subreddit(subreddit: str, max_posts: int = 10):
    url = f"https://old.reddit.com/r/{subreddit}/"
    response = requests.get(url, headers=HEADERS)

    if response.status_code != 200:
        raise Exception(f"Failed to load subreddit: {subreddit} (Status code: {response.status_code})")

    soup = BeautifulSoup(response.text, "html.parser")
    posts = []

    for post in soup.find_all("div", class_="thing", limit=max_posts):
        title = post.find("a", class_="title")
        if not title:
            continue

        post_data = {
            "title": title.text.strip(),
            "link": title["href"],
            "subreddit": subreddit,
            "scraped_at": datetime.now(UTC)
        }

        posts.append(post_data)

    return posts
