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
    goal_id: int | None = None
    save_amount: float | None = None
    transaction_date: datetime | None = None

class TransactionUpdate(BaseModel):
    amount: float | None = None
    type: TransactionType | None = None
    category: str | None = None
    description: str | None = None
    transaction_date: datetime | None = None

class TransactionResponse(BaseModel):
    id: int
    amount: float
    type: TransactionType
    category: str
    description: str | None = None
    transaction_date: datetime
    goal_id: int | None = None

    class Config:
        from_attributes = True