from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse

from app.config import get_settings
from app.db import Base, engine
from app.routers import admin, auth, billing, links

STATIC = Path(__file__).parent / "static"


@asynccontextmanager
async def lifespan(_app: FastAPI):
    Base.metadata.create_all(engine)
    yield


app = FastAPI(title=get_settings().app_name, version="0.1.0", lifespan=lifespan,
              description="Link-shortener SaaS with subscription plans, trials and usage limits.")

for r in (auth.router, billing.router, links.router, admin.router):
    app.include_router(r)


@app.get("/", include_in_schema=False)
def index():
    return FileResponse(STATIC / "index.html")


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok"}
