# Documentação da API (Backend)

Esta documentação descreve os endpoints disponíveis no backend do sistema de Roteirização Médica.

A API foi desenvolvida em **FastAPI**, rodando nativamente na porta `8000`.

## 🌐 Onde ver a documentação interativa
Com o backend em execução, você pode visualizar e testar os endpoints diretamente através da interface interativa **Swagger UI**:
👉 **URL:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🚀 Endpoints Disponíveis

### 1. Otimizar Rotas
**Endpoint:** `POST /optimize`

Gera as coordenadas e otimiza as rotas logísticas utilizando o Algoritmo Genético, com base nas restrições solicitadas.

#### O que recebe (Payload / Body JSON):
Todos os campos são opcionais e possuem valores padrão.
```json
{
  "points": 20,            // Número de pontos/pacientes a gerar (padrão 20)
  "generations": 100,      // Número de gerações do GA (padrão 100)
  "vehicles": 1,           // Número de veículos na frota (padrão 1)
  "speed_kmh": 60.0,       // Velocidade média em km/h (padrão 60.0)
  "max_capacity": 100,     // Capacidade máxima de itens por veículo (padrão 100)
  "max_distance": 300      // Distância máxima por veículo em km (padrão 300)
}
```

#### O que retorna (Response JSON):
```json
{
  "routes": [
    [0, 5, 12, 3, 0]       // Arrays de IDs percorridos por cada veículo (0 = Depot/Origem)
  ],
  "fitness_history": [     // Histórico do decréscimo da função penalidade a cada geração
    5345.2, 
    2100.5, 
    ...
  ],
  "total_distance": 185.4, // Distância consolidada de todos os veículos
  "estimated_time_h": 3.1, // Tempo total estimado em horas
  "points": [              // Dicionário com os metadados dos pontos gerados
    {
      "id": 0,
      "x": 50.0,
      "y": 50.0,
      "priority": 0,
      "demand": 0
    },
    ...
  ]
}
```

---

### 2. Gerar Relatório / Co-Piloto (LLM)
**Endpoint:** `POST /report`

Analisa a roteirização previamente feita e gera um relatório gerencial ou responde a uma dúvida utilizando a Inteligência Artificial Google Gemini.

#### O que recebe (Payload / Body JSON):
Deve-se enviar os dados estatísticos que saíram da requisição de otimização, com a adição opcional de uma pergunta.
```json
{
  "points": [...],                 // Array integral de pontos retornado pelo /optimize
  "routes": [[0, 1, 0]],           // Array de rotas retornado pelo /optimize
  "total_distance": 185.4,         // Distância total
  "estimated_time_h": 3.1,         // Tempo
  "question": "Tem algum atraso?"  // (Opcional) Pergunta direta para o modo Q&A
}
```

#### O que retorna (Response JSON 200 OK):
Retorna a resposta elaborada textualmente pelo LLM, estruturada em Markdown.
```json
{
  "report": "### 1. Instruções Operacionais\nSiga primeiro para o ponto 5 pois é mais urgente..."
}
```

*Obs: Pode retornar erro HTTP `503 Service Unavailable` caso a chave de API (`GEMINIAI_API_KEY`) não esteja configurada no `.env`.*

---

## 🧪 Como testar a API

Existem três formas recomendáveis de realizar testes na API:

1. **Via Swagger UI (Recomendado e Gráfico)**:
   - Acesse o navegador em: [http://localhost:8000/docs](http://localhost:8000/docs).
   - Clique no endpoint que deseja testar e depois na opção **"Try it out"**.
   - Insira os dados no Request body JSON.
   - Pressione o botão grand **"Execute"**. O resultado aparecerá logo abaixo.

2. **Via cURL (Terminal)**:
   - *Exemplo testando `/optimize`:*
     ```bash
     curl -X POST "http://localhost:8000/optimize" \
     -H "Content-Type: application/json" \
     -d '{"points": 15, "vehicles": 2}'
     ```

3. **Utilizando Clients REST (Ex: Postman / Insomnia)**:
   - Crie uma requisição apontando para o método **POST**.
   - Configure a URL: `http://localhost:8000/optimize`.
   - Na aba **Body**, selecione formato **RAW > JSON**.
   - Insira seus parâmetros JSON de teste e clique em *Send*.
