from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.api import router as api_router

app = FastAPI(title="Route Optimization API", version="0.1.0")

origins = ["http://localhost:4200"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)  # /api/...