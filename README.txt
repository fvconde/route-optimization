rodar backend a partir da raiz do repositório:
cd backend
.venv\Scripts\activate
uvicorn main:app --reload --host localhost --port 8000

acessar o swagger
http://localhost:8000/docs

rodar o frontend 
cd frontend
npm start

rodar testes unitarios backend (ja com o ambiente ativado)
cd backend
.venv\Scripts\pytest -v tests/