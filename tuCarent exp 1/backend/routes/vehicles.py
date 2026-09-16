from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Vehicle, Booking
from schemas import VehicleResponse
from typing import List

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

@router.get("/", response_model=List[VehicleResponse])
def list_vehicles(db: Session = Depends(get_db)):
    return db.query(Vehicle).all()

@router.get("/{vehicle_id}/booked-dates")
def get_booked_dates(vehicle_id: int, db: Session = Depends(get_db)):
    bookings = db.query(Booking).filter(
        Booking.vehicle_id == vehicle_id,
        Booking.status.in_(["pending", "confirmed"])
    ).all()
    
    booked_dates = []
    from datetime import timedelta
    for b in bookings:
        current = b.start_date
        while current <= b.end_date:
            booked_dates.append(str(current))
            current += timedelta(days=1)
            
    return {"booked_dates": list(set(booked_dates))}
