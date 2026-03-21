def priority_penalty(route):
    penalty = 0

    for idx, p in enumerate(route):
        if p["priority"] == 3 and idx > 3:
            penalty += 1000
        elif p["priority"] == 2 and idx > 6:
            penalty += 500

    return penalty


def time_penalty(route, speed_kmh):
    penalty = 0

    current_time = 8.0  # começa às 8h

    for p in route:
        # tempo de deslocamento
        if "dist" in p:
            dist = p["dist"]
        else:
            dist = 0

        travel_time = dist / speed_kmh
        current_time += travel_time

        # SLA por prioridade
        if p["priority"] == 3:  # urgente
            if current_time > 10:  # 2h depois (8h + 2h)
                penalty += 2000

        elif p["priority"] == 2:
            if current_time > 12:  # 4h depois
                penalty += 1000

        elif p["priority"] == 1:
            if current_time > 16:  # 8h depois
                penalty += 300

        # fora do horário comercial
        if current_time > 18:
            penalty += 5000

    return penalty