from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.api import router

app = FastAPI(title="Route Optimization API", version="0.1.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)