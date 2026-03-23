from fastapi.testclient import TestClient
import pytest
from unittest.mock import patch, MagicMock

# Import the FastAPI app
from main import app

client = TestClient(app)

def test_optimize_endpoint():
    """Test the /optimize endpoint to ensure it returns the correct structure."""
    payload = {
        "points": 5, 
        "generations": 2, # Small generation size to keep tests blazing fast
        "vehicles": 1,
        "speed_kmh": 60,
        "max_capacity": 100,
        "max_distance": 300
    }
    
    response = client.post("/optimize", json=payload)
    assert response.status_code == 200
    
    data = response.json()
    assert "routes" in data
    assert "fitness_history" in data
    assert "total_distance" in data
    assert "estimated_time_h" in data
    assert "points" in data
    
    assert len(data["points"]) == 5 # 4 customers + 1 depot

@patch("services.llm_service.genai.GenerativeModel")
@patch("services.llm_service.genai.configure")
@patch("os.getenv")
def test_report_endpoint_base(mock_getenv, mock_configure, mock_model_class):
    """Test the /report endpoint without a user question."""
    # Mock finding the API Key
    mock_getenv.return_value = "fake_api_key_for_testing"
    
    # Mock the LLM generation response
    mock_model_instance = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "Relatório Mockado do Gemini"
    mock_model_instance.generate_content.return_value = mock_response
    mock_model_class.return_value = mock_model_instance

    payload = {
        "points": [{"id": 0, "priority": 0, "demand": 0}, {"id": 1, "priority": 3, "demand": 15}],
        "routes": [[0, 1]],
        "total_distance": 100,
        "estimated_time_h": 1.5
    }
    
    response = client.post("/report", json=payload)
    
    assert response.status_code == 200
    assert response.json() == {"report": "Relatório Mockado do Gemini"}
    
    # Verify it called Gemini correctly
    mock_configure.assert_called_once_with(api_key="fake_api_key_for_testing")
    mock_model_class.assert_called_once_with("gemini-2.5-flash")
    mock_model_instance.generate_content.assert_called_once()
    
    # Verify the prompt string contained specific keywords for the core report
    call_args = mock_model_instance.generate_content.call_args[0][0]
    assert "Gere um relatório gerencial em Markdown" in call_args

@patch("services.llm_service.genai.GenerativeModel")
@patch("services.llm_service.genai.configure")
@patch("os.getenv")
def test_report_endpoint_question(mock_getenv, mock_configure, mock_model_class):
    """Test the /report endpoint with a specific user question (Q&A mode)."""
    mock_getenv.return_value = "fake_api_key_for_testing"
    
    mock_model_instance = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "Resposta Mockada do Gemini Q&A"
    mock_model_instance.generate_content.return_value = mock_response
    mock_model_class.return_value = mock_model_instance

    payload = {
        "points": [],
        "routes": [],
        "question": "Qual é a situação da rota?"
    }
    
    response = client.post("/report", json=payload)
    
    assert response.status_code == 200
    assert response.json() == {"report": "Resposta Mockada do Gemini Q&A"}
    
    # Verify the prompt string contained the specific question prompt
    call_args = mock_model_instance.generate_content.call_args[0][0]
    assert "Assistente Especialista em Logística Hospitalar" in call_args
    assert 'PERGUNTA DO USUÁRIO: "Qual é a situação da rota?"' in call_args
    
def test_report_endpoint_no_api_key():
    """Verify endpoint crashes gracefully when API key is missing."""
    import os
    # Temporarily remove key if exists
    original_key = os.environ.get("GEMINIAI_API_KEY")
    if "GEMINIAI_API_KEY" in os.environ:
        del os.environ["GEMINIAI_API_KEY"]
        
    try:
        response = client.post("/report", json={})
        assert response.status_code == 503
        assert "GEMINIAI_API_KEY não configurada" in response.json()["detail"]
    finally:
        if original_key is not None:
            os.environ["GEMINIAI_API_KEY"] = original_key
