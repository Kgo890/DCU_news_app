import pytest
from httpx import AsyncClient
from backend.main import app


@pytest.mark.asyncio
async def test_scrape():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/reddit/scrape", params={"subreddit": "DC_Cinematic", "max_posts": 2})
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        assert len(response.json()) <= 2


@pytest.mark.asyncio
async def test_get_all_posts():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/reddit/posts")
        assert response.status_code == 200
        assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_get_posts_by_subreddit():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/reddit/posts_by_subreddit", params={"subreddit": "DC_Cinematic"})
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list) or "error" in data


@pytest.mark.asyncio
async def test_get_posts_by_date_range():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        from_date = "2025-07-01T00:00:00"
        to_date = "2025-07-31T23:59:59"
        response = await ac.get("/reddit/posts_by_date_range", params={"from_date": from_date, "to_date": to_date})
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list) or "error" in data


@pytest.mark.asyncio
async def test_get_posts_by_tag():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/reddit/posts_by_tag_or_character", params={"tag": "Superman"})
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list) or "error" in data


@pytest.mark.asyncio
async def test_get_daily_top_posts():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/reddit/timeline")
        assert response.status_code == 200
        assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_delete_all_posts():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.delete("/reddit/delete_all_post")
        assert response.status_code == 200
        assert "message" in response.json()
