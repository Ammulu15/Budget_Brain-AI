from pydantic import BaseModel

class BudgetCreate(BaseModel):
    category: str
    limit_amount: float
    month: str

class BudgetResponse(BaseModel):
    id: int
    category: str
    limit_amount: float
    month: str

    class Config:
        from_attributes = True