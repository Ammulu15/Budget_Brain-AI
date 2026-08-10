from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.transaction import Transaction
from app.models.user import User
from app.core.security import get_current_user
from app.core.ai_assistant import generate_financial_insights

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

@router.get("/insights")
def get_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    insights = generate_financial_insights(transactions)
    return {"insights": insights}