# backend/auth.py
from fastapi import HTTPException, status, Header
from jose import jwt, JWTError
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import bcrypt

# -----------------------------
# CONFIG
# -----------------------------
SECRET_KEY = "tucarent-exp1-secret-key-2026-change-in-prod"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

# Admin credentials
ADMIN_EMAIL = "admin@tucarent.com"
ADMIN_PASSWORD = "Admin123!"

# Using bcrypt directly — passlib is incompatible with Python 3.14+


# -----------------------------
# PASSWORD HELPERS
# -----------------------------
def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


# -----------------------------
# JWT GENERATION
# -----------------------------
def create_access_token(data: Dict[str, Any]):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    # Force string
    to_encode.update({
        "exp": expire,
        "sub": str(to_encode["sub"])
    })

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# -----------------------------
# DECODE TOKEN
# -----------------------------
def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# -----------------------------
# USER TOKEN HELPER
# -----------------------------
def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    scheme, token = authorization.split()
    if scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid auth scheme")

    payload = decode_access_token(token)
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    return int(user_id)


# -----------------------------
# ADMIN AUTH HELPERS
# -----------------------------
def validate_admin_credentials(email: str, password: str) -> bool:
    return email == ADMIN_EMAIL and password == ADMIN_PASSWORD


def verify_admin_token(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing admin token")

    scheme, token = authorization.split()
    if scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid token format")

    payload = decode_access_token(token)

    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admins only")

    return True
