from fastapi import APIRouter
from ga import run_ga
from tsp import generate_points
from pydantic import BaseModel
from services.llm_service import generate_report
from fastapi import HTTPException

class OptimizeRequest(BaseModel):
    points: int = 20
    generations: int = 100
    vehicles: int = 1
    speed_kmh: float = 60
    max_capacity: int = 100
    max_distance: int = 300
    seed: int | None = None

router = APIRouter()

import random

@router.post("/optimize")
def optimize(data: OptimizeRequest):
    if data.seed is not None:
        random.seed(data.seed)
    else:
        random.seed()
        
    points = generate_points(data.points)

    routes, history, dist = run_ga(
        points,
        generations=data.generations,
        vehicles=data.vehicles,
        speed_kmh=data.speed_kmh,
        max_capacity=data.max_capacity,
        max_distance=data.max_distance
    )
    
    time_hours = dist / data.speed_kmh

    return {
        "routes": [[p["id"] for p in route] for route in routes],
        "fitness_history": history,
        "total_distance": dist,
        "estimated_time_h": round(time_hours, 2),
        "points": points
    }

@router.post("/report")
def report(data: dict):
    try:
        text = generate_report(data)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return {"report": text}
