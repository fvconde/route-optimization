from fastapi import FastAPI
from services.api import router

app = FastAPI(title="Route Optimization API", version="0.1.0")

app.include_router(router)