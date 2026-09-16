from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from datetime import date

from database import get_db
from models import Booking, Chauffeur, User
from auth import decode_access_token

router = APIRouter(prefix="/chauffeur", tags=["Chauffeur"])

def _get_user_from_auth(authorization: Optional[str] = Header(None)) -> int:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")
    try:
        scheme, token = authorization.split(" ")
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid auth format")
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        role = payload.get("role")
        if not user_id or str(user_id) == "admin":
            raise HTTPException(status_code=401, detail="Invalid token payload")
        if role != "chauffeur":
            raise HTTPException(status_code=403, detail="Chauffeurs only")
        return int(user_id)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    user_id: int = Depends(_get_user_from_auth),
):
    chauffeur = db.query(Chauffeur).filter(Chauffeur.user_id == user_id).first()
    if not chauffeur:
        raise HTTPException(status_code=404, detail="Chauffeur profile not found")

    active = db.query(Booking).filter(
        Booking.chauffeur_id == chauffeur.id,
        Booking.status.in_(["pending","confirmed"])
    ).count()
    completed = db.query(Booking).filter(
        Booking.chauffeur_id == chauffeur.id,
        Booking.status == "completed"
    ).count()
    total = db.query(Booking).filter(
        Booking.chauffeur_id == chauffeur.id
    ).count()

    return {"active_trips": active, "completed_trips": completed, "total_assignments": total}

@router.get("/trips")
def trips(
    db: Session = Depends(get_db),
    user_id: int = Depends(_get_user_from_auth),
):
    chauffeur = db.query(Chauffeur).filter(Chauffeur.user_id == user_id).first()
    if not chauffeur:
        raise HTTPException(status_code=404, detail="Chauffeur profile not found")

    active_trips = (
        db.query(Booking)
        .options(joinedload(Booking.vehicle), joinedload(Booking.user))
        .filter(Booking.chauffeur_id == chauffeur.id, Booking.status.in_(["pending","confirmed"]))
        .order_by(Booking.id.desc())
        .all()
    )
    history = (
        db.query(Booking)
        .options(joinedload(Booking.vehicle), joinedload(Booking.user))
        .filter(Booking.chauffeur_id == chauffeur.id, Booking.status.in_(["completed","cancelled"]))
        .order_by(Booking.id.desc())
        .all()
    )
    return {"active": active_trips, "history": history}

@router.put("/trips/{trip_id}/complete")
def complete_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(_get_user_from_auth),
):
    chauffeur = db.query(Chauffeur).filter(Chauffeur.user_id == user_id).first()
    if not chauffeur:
        raise HTTPException(status_code=404, detail="Chauffeur profile not found")

    trip = db.query(Booking).filter(Booking.id == trip_id, Booking.chauffeur_id == chauffeur.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found or not assigned to you")

    if trip.status not in ["pending", "confirmed"]:
        raise HTTPException(status_code=400, detail=f"Cannot complete a {trip.status} trip")

    trip.status = "completed"
    db.commit()
    db.refresh(trip)
    return {"message": "Trip marked as completed", "trip_id": trip.id}
