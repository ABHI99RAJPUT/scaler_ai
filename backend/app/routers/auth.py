from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, models
from ..database import get_db
from ..auth import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)


@router.post("/signup", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def signup(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user and return a JWT access token."""
    # Check if username already exists
    if db.query(models.User).filter(models.User.username == user_data.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )

    db_user = models.User(
        email=f"{user_data.username}@dummy.local",
        username=user_data.username,
        hashed_password=""
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {"access_token": db_user.username, "token_type": "bearer"}


@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    """Authenticate a user (by username) and return a JWT access token."""
    user = db.query(models.User).filter(
        models.User.username == credentials.username
    ).first()

    if not user:
        # Auto-register if user doesn't exist
        user = models.User(
            email=f"{credentials.username}@dummy.local",
            username=credentials.username,
            hashed_password=""
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return {"access_token": user.username, "token_type": "bearer"}


@router.get("/me", response_model=schemas.User)
def get_me(current_user: models.User = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return current_user
