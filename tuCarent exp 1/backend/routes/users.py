from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import UserCreate, UserOut, UserLogin
from crud import create_user, get_user_by_email, verify_password
from auth import create_access_token, ADMIN_EMAIL, ADMIN_PASSWORD

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/register", response_model=UserOut)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = create_user(db=db, user=user)
    return new_user

@router.post("/login")
def login_user(data: UserLogin, db: Session = Depends(get_db)):
    email = data.email
    password = data.password

    # Admin login (kept for compatibility)
    if email == ADMIN_EMAIL and password == ADMIN_PASSWORD:
        token = create_access_token({"sub": "admin", "role": "admin"})
        return {"token": token, "role": "admin"}

    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.id, "role": user.role})
    return {
        "token": token,
        "role": user.role,
        "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}
    }
