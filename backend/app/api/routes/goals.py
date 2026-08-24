from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.goal import Goal, GoalContribution
from app.models.user import User
from app.schemas.goal import GoalCreate, GoalResponse, ContributionRequest, ContributionResponse
from app.core.security import get_current_user

router = APIRouter(prefix="/goals", tags=["Goals"])

@router.post("/", response_model=GoalResponse)
def create_goal(
    goal_data: GoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_goal = Goal(**goal_data.model_dump(), user_id=current_user.id)
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal


@router.get("/", response_model=List[GoalResponse])
def list_goals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Goal).filter(Goal.user_id == current_user.id).all()

@router.patch("/{goal_id}/contribute", response_model=GoalResponse)
def contribute_to_goal(
    goal_id: int,
    contribution: ContributionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user.id
    ).first()

    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    goal.saved_amount += contribution.amount
    new_contribution = GoalContribution(goal_id=goal.id, amount=contribution.amount)
    db.add(new_contribution)
    db.commit()
    db.refresh(goal)
    return goal

@router.get("/{goal_id}/history", response_model=List[ContributionResponse])
def get_goal_history(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return db.query(GoalContribution).filter(GoalContribution.goal_id == goal_id).order_by(GoalContribution.contributed_at.desc()).all()
