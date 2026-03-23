import pytest
from tsp import generate_points, distance, total_distance

def test_generate_points_length():
    """Teste if generation handles lengths precisely N points."""
    n = 10
    points = generate_points(n)
    assert len(points) == n
    
def test_generate_points_depot():
    """Test if the first point is always the depot with proper ID and fixed coordinates."""
    points = generate_points(5)
    depot = points[0]
    assert depot["id"] == 0
    assert depot["x"] == 50.0
    assert depot["y"] == 50.0
    assert depot["priority"] == 0

def test_generate_points_bounds():
    """Test if attributes are strictly bound."""
    points = generate_points(50)
    for p in points[1:]:
        assert 1 <= p["priority"] <= 3
        assert 10 <= p["demand"] <= 50
        assert 0 <= p["x"] <= 100
        assert 0 <= p["y"] <= 100

def test_distance_calculation():
    """Test standard distance hyp"""
    a = {"x": 0, "y": 0}
    b = {"x": 3, "y": 4}
    # hypot(3,4) = 5
    assert distance(a, b) == 5.0
