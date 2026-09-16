from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from auth import create_access_token

router = APIRouter(prefix="/admin", tags=["Admin Authentication"])

ADMIN_EMAIL = "admin@rodify.com"
ADMIN_PASSWORD = "Admin123!"


class AdminLogin(BaseModel):
    email: str
    password: str


@router.post("/login")
def admin_login(data: AdminLogin):
    if data.email != ADMIN_EMAIL or data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    token = create_access_token({"role": "admin"})

    return {"access_token": token, "token_type": "bearer"}
