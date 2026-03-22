import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

def _configure_client():
    api_key = os.getenv("GEMINIAI_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GEMINIAI_API_KEY não configurada. Defina a variável de ambiente para usar /report."
        )
    genai.configure(api_key=api_key)

def generate_report(data: dict) -> str:
    prompt = f"""
    Você é um assistente logístico hospitalar.

    Analise os dados abaixo e gere um relatório claro:

    - Distância total: {data['total_distance']}
    - Tempo estimado: {data['estimated_time_h']} horas
    - Número de rotas: {len(data['routes'])}

    Considere:
    - Prioridades (3 = urgente)
    - Eficiência da rota
    - Possíveis melhorias

    Gere um resumo profissional.
    """

    _configure_client()
    
    # Adicionando o contexto explicitamente na chamada principal, já que system_instruction costuma ser feito na inicialização.
    full_prompt = (
        "Contexto: Você é um especialista em logística hospitalar.\n\n"
        + prompt
    )

    model = genai.GenerativeModel("gemini-2.5-flash")
    
    response = model.generate_content(full_prompt)

    return response.text
