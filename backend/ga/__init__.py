import random
import numpy as np
from tsp import total_distance, distance
from constraints import priority_penalty, time_penalty


import random
import numpy as np
from tsp import total_distance, distance
from constraints import priority_penalty, time_penalty

def split_routes(customers, vehicles, depot):
    splits = np.array_split(customers, vehicles)
    return [[depot] + s.tolist() for s in splits if len(s) > 0]

def fitness(customers, vehicles, depot, speed_kmh=60):
    routes = split_routes(customers, vehicles, depot)
    total_dist = 0
    penalty = 0
    
    for route in routes:
        total_dist += total_distance(route)
        
        # calculate distances between points inside the route
        route[0]["dist"] = 0
        for i in range(1, len(route)):
            route[i]["dist"] = distance(route[i], route[i-1])
            
        penalty += priority_penalty(route)
        penalty += time_penalty(route, speed_kmh)
        
    return total_dist + penalty

def create_population(customers, size=80):
    return [random.sample(customers, len(customers)) for _ in range(size)]

def selection(pop, vehicles, depot, speed):
    return min(random.sample(pop, 5), key=lambda r: fitness(r, vehicles, depot, speed))

def crossover(p1, p2):
    start, end = sorted(random.sample(range(len(p1)), 2))
    child = p1[start:end]
    return child + [p for p in p2 if p not in child]

def mutate(route, rate=0.1):
    if random.random() < rate:
        i, j = random.sample(range(len(route)), 2)
        route[i], route[j] = route[j], route[i]
    return route

def run_ga(points, generations=100, vehicles=1, speed_kmh=60):
    depot = points[0]
    customers = points[1:]
    
    pop = create_population(customers)
    history = []

    for _ in range(generations):
        new_pop = []
        for _ in range(len(pop)):
            p1 = selection(pop, vehicles, depot, speed_kmh)
            p2 = selection(pop, vehicles, depot, speed_kmh)

            child = mutate(crossover(p1, p2))
            new_pop.append(child)

        pop = new_pop
        best = min(pop, key=lambda r: fitness(r, vehicles, depot, speed_kmh))
        history.append(fitness(best, vehicles, depot, speed_kmh))

    best = min(pop, key=lambda r: fitness(r, vehicles, depot, speed_kmh))
    routes = split_routes(best, vehicles, depot)

    total_dist = sum(total_distance(r) for r in routes)

    return routes, history, total_dist