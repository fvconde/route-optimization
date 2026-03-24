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

def _build_context(data: dict) -> str:
    points = data.get("points", [])
    routes = data.get("routes", [])
    
    context = f"""
    ESTATÍSTICAS GERAIS:
    - Distância total: {data.get('total_distance', 0):.2f} km
    - Tempo estimado: {data.get('estimated_time_h', 0):.2f} horas
    - Veículos: {len(routes)}
    """
    
    if points and routes:
        points_map = {p['id']: p for p in points}
        context += "\nROTAS E ENTREGAS:\n"
        for v_idx, route in enumerate(routes):
            context += f"Veículo {v_idx + 1}:\n"
            for p_id in route:
                if p_id == 0:
                    context += f"  - [Origem/Depot]\n"
                else:
                    p = points_map.get(p_id, {})
                    priority = p.get('priority', 'N/A')
                    demand = p.get('demand', 'N/A')
                    context += f"  - Ponto {p_id} | Prioridade (1=baixa, 3=alta): {priority} | Demanda: {demand}\n"
                    
    context += """
    REGRAS DE PENALIDADE DO SISTEMA (Restrições Operacionais):
    - Capacidade Máxima do Veículo: Excesso de carga penaliza o fitness severamente.
    - Distância Máxima por Rota: Otimizada para não exceder limites logísticos.
    - SLA de Posição na Rota: Prioridade 3 deve estar idealmente até a 3ª parada. Prioridade 2 até a 6ª parada.
    - SLA de Tempo (Início às 08:00):
        - Prioridade 3: Limite máximo tolerado é 10:00 (2h de percurso).
        - Prioridade 2: Limite máximo tolerado é 12:00 (4h de percurso).
        - Prioridade 1: Limite máximo tolerado é 16:00 (8h de percurso).
    - Horário Comercial: Nenhuma entrega deve ocorrer após as 18:00 (10h de percurso).
    
    Por favor, utilize estas regras como contexto para justificar e analisar o formato das rotas, identificando por que certos nós puderam ser priorizados geograficamente de forma contra-intuitiva devido a SLAs de tempo ou prioridade.
    """
    
    return context

def generate_report(data: dict) -> str:
    _configure_client()
    context = _build_context(data)
    
    question = data.get("question")
    
    if question:
        prompt = f"""
        Você é um Assistente Especialista em Logística Hospitalar.
        Baseado EXCLUSIVAMENTE nos dados da última roteirização, responda à pergunta do usuário.

        {context}
        
        PERGUNTA DO USUÁRIO: "{question}"
        
        Responda de forma direta, analítica e cite os dados da rota.
        """
    else:
        prompt = f"""
        Você é um Assistente Especialista em Logística Hospitalar baseado em Algoritmos Genéticos.
        Gere um relatório gerencial em Markdown analisando a roteirização atual:

        DADOS DA OTIMIZAÇÃO:
        {context}

        Gere um relatório contendo os seguintes tópicos estruturados:
        
        ### 1. Instruções Operacionais
        Liste orientações claras e a ordem de entregas. Alerte expressamente sobre entregas de Prioridade 3 (alta urgência).
        
        ### 2. Eficiência das Rotas
        Avalie o tempo total e a distância, comentando o balanceamento de carga/distância entre os veículos (se houver mais de um).
        
        ### 3. Insights e Melhorias
        Aponte gargalos (ex: pontos urgentes muito no fim da rota) e proponha melhorias reais no processo.
        """

    model = genai.GenerativeModel("gemini-2.5-flash")
    
    response = model.generate_content(prompt)

    return response.text
