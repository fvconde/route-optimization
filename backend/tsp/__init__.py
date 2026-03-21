import random
import math


def generate_points(n):
    points = []
    points.append({
        "id": 0,
        "x": 50.0,
        "y": 50.0,
        "priority": 0
    })
    for i in range(1, n):
        points.append({
            "id": i,
            "x": random.uniform(0, 100),
            "y": random.uniform(0, 100),
            "priority": random.randint(1, 3)
        })
    return points


def distance(a, b):
	return math.hypot(a["x"] - b["x"], a["y"] - b["y"])


def total_distance(route):
	return sum(distance(route[i], route[(i + 1) % len(route)]) for i in range(len(route)))
