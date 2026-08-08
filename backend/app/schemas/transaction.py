from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class TransactionType(str, Enum):
    income = "income"
    expense = "expense"

class TransactionCreate(BaseModel):
    amount: float
    type: TransactionType
    category: str
    description: str | None = None

class TransactionResponse(BaseModel):
    id: int
    amount: float
    type: TransactionType
    category: str
    description: str | None = None
    transaction_date: datetime

    class Config:
        from_attributes = True