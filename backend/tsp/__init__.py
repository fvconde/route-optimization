import random
import math


def generate_points(n):
	return [
		{
			"id": i,
			"x": random.uniform(0, 100),
			"y": random.uniform(0, 100),
			"priority": random.randint(1, 3)
		}
		for i in range(n)
	]


def distance(a, b):
	return math.hypot(a["x"] - b["x"], a["y"] - b["y"])


def total_distance(route):
	return sum(distance(route[i], route[(i + 1) % len(route)]) for i in range(len(route)))
