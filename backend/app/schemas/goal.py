from pydantic import BaseModel
from datetime import datetime

class GoalCreate(BaseModel):
    title: str
    target_amount: float
    target_date: datetime | None = None

class GoalResponse(BaseModel):
    id: int
    title: str
    target_amount: float
    saved_amount: float
    target_date: datetime | None = None

    class Config:
        from_attributes = True
        
class ContributionRequest(BaseModel):
    amount: float