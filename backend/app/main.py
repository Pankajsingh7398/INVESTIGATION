import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError
from app.core.config import settings
from app.core.exceptions import AppException, app_exception_handler
from app.db.session import engine
from app.db.base import Base

# Import all models to ensure metadata registration
import app.models # noqa

logger = logging.getLogger(__name__)

def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully.")
    except OperationalError as e:
        logger.warning(
            f"Could not connect to PostgreSQL at {settings.DATABASE_URL} ({e}). "
            "Ensure your PostgreSQL server or container is running."
        )

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev/testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
app.add_exception_handler(AppException, app_exception_handler)

# Include API Routers
from app.api.v1.cases import router as cases_router
from app.api.v1.evidence import router as evidence_router
from app.api.v1.processing import router as processing_router
from app.api.v1.entities import router as entities_router
from app.api.v1.relationships import router as relationships_router
from app.api.v1.timeline import router as timeline_router
from app.api.v1.graph import router as graph_router
from app.api.v1.custody import router as custody_router
from app.api.v1.assistant import router as assistant_router
from app.api.v1.demo import router as demo_router

api_v1_prefix = settings.API_V1_STR
app.include_router(cases_router, prefix=api_v1_prefix)
app.include_router(evidence_router, prefix=api_v1_prefix)
app.include_router(processing_router, prefix=api_v1_prefix)
app.include_router(entities_router, prefix=api_v1_prefix)
app.include_router(relationships_router, prefix=api_v1_prefix)
app.include_router(timeline_router, prefix=api_v1_prefix)
app.include_router(graph_router, prefix=api_v1_prefix)
app.include_router(custody_router, prefix=api_v1_prefix)
app.include_router(assistant_router, prefix=api_v1_prefix)
app.include_router(demo_router, prefix=api_v1_prefix)

# Also expose direct endpoints matching frontend contracts (/cases, /evidence, /graph, /timeline, /ask)
app.include_router(cases_router)
app.include_router(evidence_router)
app.include_router(entities_router)
app.include_router(relationships_router)
app.include_router(timeline_router)
app.include_router(graph_router)
app.include_router(custody_router)
app.include_router(assistant_router)
app.include_router(demo_router)

@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "owner": "Pankaj (Backend & Database)"
    }
