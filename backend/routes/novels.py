from scrapers.scraper_manager import ScraperManager
from fastapi import (
    APIRouter,
    HTTPException,
    WebSocket,
    WebSocketDisconnect,
    BackgroundTasks,
)
import sys
import asyncio
import json


sys.path.append(r"E:\python\novels\scrapers")
from scraper_manager import ScraperManager

sys.path.append(r"E:\python\novels\backend\utils")
from epub_creator import create_book_for_novel, get_chapter_content, progress_dict

router = APIRouter()
scraper_manager = ScraperManager()


router = APIRouter()
scraper_manager = ScraperManager()


@router.get("/novels/data")
async def get_novel_data(query: str):
    scraper = scraper_manager.get_scraper(query)
    if scraper:
        novel_data = scraper.get_novel_data(query)
        return novel_data
    else:
        return {"error": "No scraper available for this URL"}


@router.get("/novels/search")
async def search_novel(query: str):
    results = scraper_manager.search_novel(query)
    return results


@router.post("/novels/create_epub")
async def create_epub(query: str, background_tasks: BackgroundTasks):
    scraper = scraper_manager.get_scraper(query)
    if scraper:
        novel_data = scraper.get_novel_data(query)
        if novel_data:
            output_path = f"{novel_data.title}.epub"
            background_tasks.add_task(create_book_for_novel, novel_data, query)
            return {"message": "EPUB creation started", "path": output_path}
        else:
            raise HTTPException(status_code=404, detail="Novel data not found")
    else:
        raise HTTPException(status_code=404, detail="No scraper available for this URL")


@router.websocket("/ws/progress")
async def websocket_progress(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            if progress_dict:
                await websocket.send_text(json.dumps(progress_dict))
            await asyncio.sleep(0.5)
    except WebSocketDisconnect:
        print("WebSocket disconnected")
