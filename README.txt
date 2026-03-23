========================================================================
            TECH CHALLENGE 2 - ROTEIRIZAÇÃO MÉDICA E CO-PILOTO
========================================================================

Este repositório contém o código-fonte do sistema de roteirização médica com Algoritmos Genéticos (GA) e Inteligência Artificial (LLM). O sistema é dividido entre um Backend em Python FastAPI e um Frontend em Angular.

------------------------------------------------------------------------
1. PRÉ-REQUISITOS
------------------------------------------------------------------------
Certifique-se de ter os seguintes componentes instalados em sua máquina:
- Node.js (v18+ recomendado)
- Angular CLI (opcional, pode-se usar npx)
- Python (v3.10+ recomendado)
- Gerenciador de Pacotes Python (Pip)


------------------------------------------------------------------------
2. INSTALANDO E RODANDO O BACKEND (FastAPI)
------------------------------------------------------------------------
Abra um terminal na raiz do repositório e siga os passos abaixo:

A. Acesse a pasta do backend:
   cd backend

B. Crie o seu ambiente virtual Python (caso ainda não exista):
   python -m venv .venv

C. Ative o ambiente virtual:
   - No Windows:  .venv\Scripts\activate
   - No Linux/Mac: source .venv/bin/activate

D. Instale as dependências contidas no requirements.txt:
   pip install -r requirements.txt
   
   (Observação: Para os testes, talvez o requirements.txt não inclua pytest. Se assim for, rode `pip install pytest pytest-mock httpx` manualmente dentro do .venv).

E. Configure sua chave de API do Gemini:
   - Existe um arquivo `.env.example` na pasta backend.
   - Renomeie-o para `.env` (ou crie um novo).
   - Insira sua chave no formato: GEMINIAI_API_KEY=sua_chave_aqui

F. Inicie o Servidor da API:
   uvicorn main:app --reload --host localhost --port 8000
   
   -> A API estará rodando. Você pode conferir a documentação do Swagger acessando a URL: 
   http://localhost:8000/docs


------------------------------------------------------------------------
3. INSTALANDO E RODANDO O FRONTEND (Angular)
------------------------------------------------------------------------
A partir da raiz do repositório, abra uma segunda janela/aba de terminal:

A. Acesse a pasta do frontend:
   cd frontend

B. Instale as dependências do Node.js:
   npm install

C. Inicie a aplicação no modo de desenvolvimento:
   npm start
   
   -> O painel interativo (Frontend) agora estará disponível no navegador através da URL padrão do Angular:
   http://localhost:4200


------------------------------------------------------------------------
4. EXECUTANDO OS TESTES AUTOMATIZADOS
------------------------------------------------------------------------
O projeto possui uma cobertura completa de testes (Unitários e de Integração) para as duas frentes.

A. Testes do Backend (Pytest):
   Com o ambiente ativado (.venv), acesse a pasta backend e rode:
   cd backend
   .venv\Scripts\pytest -v tests/

B. Testes do Frontend (Angular/Vitest):
   Acesse a pasta frontend e execute o test runner padrão do projeto:
   cd frontend
   npx ng test --watch=false