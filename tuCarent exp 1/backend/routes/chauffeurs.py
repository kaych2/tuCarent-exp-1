from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Chauffeur
from schemas import ChauffeurResponse

router = APIRouter(prefix="/chauffeurs", tags=["Chauffeurs"])

@router.get("/available", response_model=List[ChauffeurResponse])
def available_chauffeurs(db: Session = Depends(get_db)):
    return db.query(Chauffeur).filter(Chauffeur.status == "available").all()
