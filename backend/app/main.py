from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.models import user, transaction, budget, goal
from app.api.routes import auth, transactions, budgets, goals, ai

Base.metadata.create_all(bind=engine)

app = FastAPI(title="BudgetBrain AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://10.91.51.140:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(budgets.router)
app.include_router(goals.router)
app.include_router(ai.router)

@app.get("/")
def read_root():
    return {"message": "BudgetBrain AI backend is running"}