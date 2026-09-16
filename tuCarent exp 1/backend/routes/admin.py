from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from datetime import date

from database import get_db
from models import User, Booking, Vehicle, Chauffeur, Maintenance
from schemas import (
    AdminStats,
    VehicleCreate, VehicleResponse,
    ChauffeurCreate, ChauffeurResponse,
    MaintenanceCreate, MaintenanceResponse,
    BookingResponse
)
from auth import create_access_token, validate_admin_credentials, verify_admin_token, get_password_hash

router = APIRouter(prefix="/admin", tags=["Admin"])

# -----------------------
# ADMIN LOGIN
# -----------------------
@router.post("/login")
def admin_login(payload: dict):
    email = payload.get("email")
    password = payload.get("password")
    if not validate_admin_credentials(email, password):
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
    token = create_access_token({"sub": "admin", "role": "admin"})
    return {"token": token}

# -----------------------
# DASHBOARD STATS
# -----------------------
@router.get("/stats", response_model=AdminStats, dependencies=[Depends(verify_admin_token)])
def admin_stats(db: Session = Depends(get_db)):
    total_vehicles = db.query(Vehicle).count()
    available_now = db.query(Vehicle).filter(Vehicle.availability == "available").count()
    active_bookings = db.query(Booking).filter(Booking.status == "confirmed").count()
    pending_bookings = db.query(Booking).filter(Booking.status == "pending").count()
    return {
        "total_vehicles": total_vehicles,
        "available_now": available_now,
        "active_bookings": active_bookings,
        "pending_bookings": pending_bookings,
    }

# -----------------------
# USERS
# -----------------------
@router.get("/users", dependencies=[Depends(verify_admin_token)])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

# -----------------------
# VEHICLES CRUD
# -----------------------
@router.get("/vehicles", response_model=list[VehicleResponse], dependencies=[Depends(verify_admin_token)])
def get_all_vehicles(db: Session = Depends(get_db)):
    return db.query(Vehicle).order_by(Vehicle.id.desc()).all()

@router.post("/vehicles", response_model=VehicleResponse, dependencies=[Depends(verify_admin_token)])
def add_vehicle(payload: VehicleCreate, db: Session = Depends(get_db)):
    v = Vehicle(
        make=payload.make,
        model=payload.model,
        year=payload.year,
        type=payload.type,
        color=payload.color,
        daily_rate=payload.daily_rate,
        mileage=payload.mileage or 0,
        img=payload.img,
        availability="available",
        accidents=0,
        service_records=0,
        rating=0.0
    )
    db.add(v)
    db.commit()
    db.refresh(v)
    return v

@router.put("/vehicles/{vehicle_id}", response_model=VehicleResponse, dependencies=[Depends(verify_admin_token)])
def update_vehicle(vehicle_id: int, payload: VehicleCreate, db: Session = Depends(get_db)):
    v = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    for field in ["make","model","year","type","color","daily_rate","mileage","img"]:
        val = getattr(payload, field)
        if val is not None:
            setattr(v, field, val)
    db.commit()
    db.refresh(v)
    return v

@router.put("/vehicles/{vehicle_id}/availability", response_model=VehicleResponse, dependencies=[Depends(verify_admin_token)])
def update_vehicle_availability(vehicle_id: int, payload: dict, db: Session = Depends(get_db)):
    v = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    status_val = payload.get("availability")
    if status_val not in ["available","rented","maintenance"]:
        raise HTTPException(status_code=400, detail="Invalid availability")
    v.availability = status_val
    db.commit()
    db.refresh(v)
    return v

@router.post("/vehicles/{vehicle_id}/maintenance", response_model=MaintenanceResponse, dependencies=[Depends(verify_admin_token)])
def add_maintenance(vehicle_id: int, payload: MaintenanceCreate, db: Session = Depends(get_db)):
    v = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    m = Maintenance(
        vehicle_id=vehicle_id,
        date=payload.date,
        description=payload.description,
        cost=payload.cost,
        status=payload.status
    )
    v.availability = "maintenance"
    v.service_records = (v.service_records or 0) + 1
    db.add(m)
    db.commit()
    db.refresh(m)
    return m

@router.post("/vehicles/{vehicle_id}/accident", response_model=VehicleResponse, dependencies=[Depends(verify_admin_token)])
def report_accident(vehicle_id: int, payload: dict, db: Session = Depends(get_db)):
    v = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    v.accidents = (v.accidents or 0) + 1
    db.commit()
    db.refresh(v)
    return v

# -----------------------
# CHAUFFEURS CRUD
# -----------------------
@router.get("/chauffeurs", response_model=list[ChauffeurResponse], dependencies=[Depends(verify_admin_token)])
def list_chauffeurs(db: Session = Depends(get_db)):
    return db.query(Chauffeur).order_by(Chauffeur.id.desc()).all()

@router.post("/chauffeurs", response_model=ChauffeurResponse, dependencies=[Depends(verify_admin_token)])
def add_chauffeur(payload: ChauffeurCreate, db: Session = Depends(get_db)):
    # Check if a user with that email already exists
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    # Create the User first
    u = User(
        name=payload.name,
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        role="chauffeur"
    )
    db.add(u)
    db.commit()
    db.refresh(u)

    # Now create the Chauffeur linked to that user
    c = Chauffeur(
        user_id=u.id,
        name=payload.name,
        license_number=payload.license_number,
        experience_years=payload.experience_years,
        daily_rate=payload.daily_rate,
        status=payload.status,
        rating=0.0
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    return c

@router.put("/chauffeurs/{chauffeur_id}", response_model=ChauffeurResponse, dependencies=[Depends(verify_admin_token)])
def update_chauffeur(chauffeur_id: int, payload: ChauffeurCreate, db: Session = Depends(get_db)):
    c = db.query(Chauffeur).filter(Chauffeur.id == chauffeur_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Chauffeur not found")
    for field in ["name","license_number","experience_years","daily_rate","status"]:
        val = getattr(payload, field)
        if val is not None:
            setattr(c, field, val)
    db.commit()
    db.refresh(c)
    return c

@router.delete("/chauffeurs/{chauffeur_id}", dependencies=[Depends(verify_admin_token)])
def delete_chauffeur(chauffeur_id: int, db: Session = Depends(get_db)):
    c = db.query(Chauffeur).filter(Chauffeur.id == chauffeur_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Chauffeur not found")
    db.delete(c)
    db.commit()
    return {"ok": True}

# -----------------------
# BOOKINGS ADMIN VIEW + STATUS UPDATE
# -----------------------
@router.get("/bookings", dependencies=[Depends(verify_admin_token)])
def get_all_bookings(db: Session = Depends(get_db)):
    return db.query(Booking).options(
        joinedload(Booking.vehicle),
        joinedload(Booking.user),
        joinedload(Booking.chauffeur)
    ).order_by(Booking.id.desc()).all()

@router.put("/bookings/{booking_id}/status", dependencies=[Depends(verify_admin_token)])
def update_booking_status(booking_id: int, payload: dict, db: Session = Depends(get_db)):
    booking = db.query(Booking).options(joinedload(Booking.chauffeur), joinedload(Booking.vehicle)).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    status_val = payload.get("status")
    if status_val not in ["pending","confirmed","completed","cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid booking status")

    booking.status = status_val

    # Optional lifecycle updates
    if status_val == "confirmed":
        booking.vehicle.availability = "rented"
    if status_val in ["completed","cancelled"]:
        booking.vehicle.availability = "available"
        if booking.chauffeur:
            booking.chauffeur.status = "available"

    db.commit()
    db.refresh(booking)
    return {"ok": True, "status": booking.status}

@router.get("/users/{user_id}/bookings", dependencies=[Depends(verify_admin_token)])
def get_user_bookings(user_id: int, db: Session = Depends(get_db)):
    return (
        db.query(Booking)
        .options(joinedload(Booking.vehicle), joinedload(Booking.chauffeur))
        .filter(Booking.user_id == user_id)
        .order_by(Booking.id.desc())
        .all()
    )
