from fastapi import FastAPI
from app.db.database import engine, Base
from app.models import user, transaction
from app.api.routes import auth, transactions

Base.metadata.create_all(bind=engine)

app = FastAPI(title="BudgetBrain AI")

app.include_router(auth.router)
app.include_router(transactions.router)

@app.get("/")
def read_root():
    return {"message": "BudgetBrain AI backend is running"}