from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from datetime import date

from database import get_db
from models import Booking, Vehicle, Chauffeur, User
from schemas import BookingCreate, BookingResponse, ReviewCreate, ReviewResponse
from auth import decode_access_token

router = APIRouter(prefix="/bookings", tags=["Bookings"])

def _get_user_id_from_auth(authorization: Optional[str] = Header(None)) -> int:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")
    try:
        scheme, token = authorization.split(" ")
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid auth format")
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload: missing sub")
        if str(user_id) == "admin":
            raise HTTPException(status_code=401, detail="Admin cannot make customer bookings. Please log in as a regular customer.")
        return int(user_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token format: {str(e)}")

def _days_between(start: date, end: date) -> int:
    days = (end - start).days
    return days if days > 0 else 0

def _has_overlap(db: Session, vehicle_id: int, start_date: date, end_date: date) -> bool:
    existing = (
        db.query(Booking)
        .filter(
            Booking.vehicle_id == vehicle_id,
            Booking.status.in_(["pending", "confirmed"]),
            Booking.start_date <= end_date,
            Booking.end_date >= start_date,
        )
        .first()
    )
    return existing is not None

def _chauffeur_has_overlap(db: Session, chauffeur_id: int, start_date: date, end_date: date) -> bool:
    existing = (
        db.query(Booking)
        .filter(
            Booking.chauffeur_id == chauffeur_id,
            Booking.status.in_(["pending", "confirmed"]),
            Booking.start_date <= end_date,
            Booking.end_date >= start_date,
        )
        .first()
    )
    return existing is not None

@router.post("/", response_model=BookingResponse)
def create_booking(
    data: BookingCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(_get_user_id_from_auth),
):
    # Validate dates
    days = _days_between(data.start_date, data.end_date)
    if days <= 0:
        raise HTTPException(status_code=400, detail="End date must be after start date.")

    # Validate user role
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if user.role not in ["customer", "chauffeur"]:
        user.role = "customer"

    # Vehicle exists
    vehicle = db.query(Vehicle).filter_by(id=data.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    if vehicle.availability == "maintenance":
        raise HTTPException(status_code=400, detail="Vehicle is under maintenance and cannot be booked.")

    # Conflict detection for vehicle
    if _has_overlap(db, vehicle.id, data.start_date, data.end_date):
        raise HTTPException(status_code=400, detail="Vehicle not available for selected dates.")

    service_type = (data.service_type or "self-drive").lower()
    if service_type not in ["self-drive", "chauffeur"]:
        service_type = "self-drive"

    chauffeur_obj = None
    chauffeur_cost = 0.0

    if service_type == "chauffeur":
        # if chauffeur_id provided, validate; else auto assign first available
        if data.chauffeur_id:
            chauffeur_obj = db.query(Chauffeur).filter(Chauffeur.id == data.chauffeur_id).first()
            if not chauffeur_obj:
                raise HTTPException(status_code=404, detail="Chauffeur not found")
            if chauffeur_obj.status != "available":
                raise HTTPException(status_code=400, detail="Selected chauffeur is not available")
            if _chauffeur_has_overlap(db, chauffeur_obj.id, data.start_date, data.end_date):
                raise HTTPException(status_code=400, detail="Chauffeur not available for selected dates.")
        else:
            candidates = db.query(Chauffeur).filter(Chauffeur.status == "available").all()
            for c in candidates:
                if not _chauffeur_has_overlap(db, c.id, data.start_date, data.end_date):
                    chauffeur_obj = c
                    break
            if not chauffeur_obj:
                raise HTTPException(status_code=400, detail="No chauffeurs available for selected dates.")

        chauffeur_cost = float(chauffeur_obj.daily_rate) * days

    car_cost = float(vehicle.daily_rate) * days
    custom_color_fee = 50.0 if data.custom_color else 0.0
    total_cost = car_cost + chauffeur_cost + custom_color_fee

    new_booking = Booking(
        user_id=user_id,
        vehicle_id=vehicle.id,
        chauffeur_id=chauffeur_obj.id if chauffeur_obj else None,
        start_date=data.start_date,
        end_date=data.end_date,
        service_type=service_type,
        pickup_location=data.pickup_location,
        pickup_time=data.pickup_time,
        custom_color=data.custom_color,
        total_cost=total_cost,
        status="pending",
    )

    db.add(new_booking)

    # If chauffeur assigned, mark chauffeur as assigned (optional realism)
    if chauffeur_obj:
        chauffeur_obj.status = "assigned"

    db.commit()
    db.refresh(new_booking)

    # eager load
    new_booking = (
        db.query(Booking)
        .options(joinedload(Booking.vehicle), joinedload(Booking.user), joinedload(Booking.chauffeur))
        .filter(Booking.id == new_booking.id)
        .first()
    )
    return new_booking

@router.get("/me", response_model=List[BookingResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    user_id: int = Depends(_get_user_id_from_auth),
):
    bookings = (
        db.query(Booking)
        .options(joinedload(Booking.vehicle), joinedload(Booking.user), joinedload(Booking.chauffeur))
        .filter(Booking.user_id == user_id)
        .order_by(Booking.id.desc())
        .all()
    )
    return bookings

@router.put("/{booking_id}/cancel", response_model=BookingResponse)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(_get_user_id_from_auth),
):
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.vehicle), joinedload(Booking.user), joinedload(Booking.chauffeur))
        .filter(Booking.id == booking_id, Booking.user_id == user_id)
        .first()
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.status = "cancelled"
    # free chauffeur if any
    if booking.chauffeur_id and booking.chauffeur:
        booking.chauffeur.status = "available"

    db.commit()
    db.refresh(booking)
    return booking
