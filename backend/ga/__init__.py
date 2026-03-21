import random
import numpy as np
from tsp import total_distance, distance
from constraints import priority_penalty, time_penalty


# -------- fitness --------
def fitness(route, speed_kmh=60):
    dist = total_distance(route)

    # calcular distâncias entre pontos
    for i in range(len(route)):
        route[i]["dist"] = distance(route[i], route[i-1])

    penalty = priority_penalty(route)
    penalty += time_penalty(route, speed_kmh)

    return dist + penalty

# -------- GA --------
def create_population(points, size=80):
	return [random.sample(points, len(points)) for _ in range(size)]


def selection(pop, speed):
    return min(random.sample(pop, 5), key=lambda r: fitness(r, speed))


def crossover(p1, p2):
	start, end = sorted(random.sample(range(len(p1)), 2))
	child = p1[start:end]
	return child + [p for p in p2 if p not in child]


def mutate(route, rate=0.1):
	if random.random() < rate:
		i, j = random.sample(range(len(route)), 2)
		route[i], route[j] = route[j], route[i]
	return route


def split_routes(route, vehicles):
	return np.array_split(route, vehicles)


# -------- execução --------
def run_ga(points, generations=100, vehicles=1, speed_kmh=60):
    pop = create_population(points)
    history = []

    for _ in range(generations):
        new_pop = []

        for _ in range(len(pop)):
            p1 = selection(pop, speed_kmh)
            p2 = selection(pop, speed_kmh)

            child = mutate(crossover(p1, p2))
            new_pop.append(child)

        pop = new_pop
        best = min(pop, key=lambda r: fitness(r, speed_kmh))
        history.append(fitness(best, speed_kmh))

    best = min(pop, key=lambda r: fitness(r, speed_kmh))
    routes = split_routes(best, vehicles)

    return routes, history, total_distance(best)