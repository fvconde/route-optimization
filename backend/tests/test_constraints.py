import pytest
from constraints import priority_penalty, time_penalty

def test_priority_penalty_ok():
    route = [
        {"id": 0, "priority": 0},
        {"id": 1, "priority": 3},  # urgent in index 1
        {"id": 2, "priority": 2},  # high in index 2
        {"id": 3, "priority": 1},
    ]
    assert priority_penalty(route) == 0

def test_priority_penalty_late_urgent():
    route = [
        {"id": 0, "priority": 0},
        {"id": 1, "priority": 1},
        {"id": 2, "priority": 1},
        {"id": 3, "priority": 1},
        {"id": 4, "priority": 3}, # index 4 (delayed urgent = +1000)
    ]
    assert priority_penalty(route) == 1000

def test_priority_penalty_late_high():
    route = [
        {"id": 0, "priority": 0},
        {"id": 1, "priority": 1},
        {"id": 2, "priority": 1},
        {"id": 3, "priority": 1},
        {"id": 4, "priority": 1},
        {"id": 5, "priority": 1},
        {"id": 6, "priority": 1},
        {"id": 7, "priority": 2}, # index 7 (delayed high = +500)
    ]
    assert priority_penalty(route) == 500

def test_time_penalty_sla_unbroken():
    """Test SLA compliance at high speed (time starts at 8:00)."""
    route = [
        {"dist": 30, "priority": 3}, # 30km @ 60km/h = 0.5h -> 8:30 (SLA < 10)
        {"dist": 60, "priority": 2}, # 60km @ 60km/h = 1.0h -> 9:30 (SLA < 12)
    ]
    assert time_penalty(route, speed_kmh=60) == 0

def test_time_penalty_sla_broken():
    """Test SLA violations (+2000 for urgent > 10h)."""
    route = [
        {"dist": 180, "priority": 3}, # 180km @ 60km/h = 3h -> Starts at 8:00, arrives at 11:00. Urgent breaks SLA.
    ]
    assert time_penalty(route, speed_kmh=60) == 2000

def test_time_penalty_business_hours_violation():
    """Test violation of the 18:00h limit."""
    route = [
        {"dist": 660, "priority": 1}, # 660km @ 60km/h = 11h -> Starts at 8:00, arrives at 19:00 (> 18:00).
    ]
    # Breaks normal SLA (+300) AND breaks commercial limit (+5000)
    # Why normal SLA? 19 > 16 (8h limit)
    assert time_penalty(route, speed_kmh=60) == 5300
