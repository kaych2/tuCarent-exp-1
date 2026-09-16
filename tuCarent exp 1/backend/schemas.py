from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date

# -----------------------------
# USERS
# -----------------------------
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "customer"   # customer | chauffeur
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    phone: Optional[str] = None

    class Config:
        from_attributes = True


# -----------------------------
# VEHICLES
# -----------------------------
class VehicleCreate(BaseModel):
    make: str
    model: str
    year: Optional[int] = None
    type: Optional[str] = None
    color: Optional[str] = None
    daily_rate: float
    mileage: Optional[int] = 0
    img: Optional[str] = None

class VehicleResponse(BaseModel):
    id: int
    make: str
    model: str
    year: Optional[int] = None
    type: Optional[str] = None
    color: Optional[str] = None
    daily_rate: float
    mileage: int
    availability: str
    accidents: int
    service_records: int
    rating: float
    img: Optional[str] = None

    class Config:
        from_attributes = True


# -----------------------------
# CHAUFFEURS
# -----------------------------
class ChauffeurCreate(BaseModel):
    name: str
    email: str
    password: str
    license_number: str
    experience_years: int = 0
    daily_rate: float = 20.0
    status: str = "available"

class ChauffeurResponse(BaseModel):
    id: int
    name: str
    license_number: str
    experience_years: int
    daily_rate: float
    rating: float
    status: str

    class Config:
        from_attributes = True


# -----------------------------
# BOOKINGS
# -----------------------------
class BookingCreate(BaseModel):
    vehicle_id: int
    start_date: date
    end_date: date
    service_type: str = "self-drive"      # self-drive | chauffeur
    chauffeur_id: Optional[int] = None
    pickup_location: Optional[str] = None
    pickup_time: Optional[str] = None
    custom_color: Optional[str] = None

    # legacy field (ignored if provided)
    total_cost: Optional[float] = None

class BookingVehicleMini(BaseModel):
    id: int
    make: str
    model: str
    year: Optional[int] = None
    type: Optional[str] = None
    daily_rate: float
    img: Optional[str] = None

    class Config:
        from_attributes = True

class BookingUserMini(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None

    class Config:
        from_attributes = True

class BookingChauffeurMini(BaseModel):
    id: int
    name: str
    daily_rate: float
    status: str

    class Config:
        from_attributes = True

class BookingResponse(BaseModel):
    id: int
    start_date: date
    end_date: date
    service_type: str
    pickup_location: Optional[str] = None
    pickup_time: Optional[str] = None
    custom_color: Optional[str] = None
    total_cost: float
    status: str
    vehicle: BookingVehicleMini
    user: Optional[BookingUserMini] = None
    chauffeur: Optional[BookingChauffeurMini] = None

    class Config:
        from_attributes = True


# -----------------------------
# MAINTENANCE
# -----------------------------
class MaintenanceCreate(BaseModel):
    date: date
    description: str
    cost: float = 0.0
    status: str = "scheduled"

class MaintenanceResponse(BaseModel):
    id: int
    vehicle_id: int
    date: date
    description: str
    cost: float
    status: str

    class Config:
        from_attributes = True


# -----------------------------
# REVIEWS
# -----------------------------
class ReviewCreate(BaseModel):
    car_rating: Optional[int] = None
    chauffeur_rating: Optional[int] = None
    comment: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    booking_id: int
    car_rating: Optional[int] = None
    chauffeur_rating: Optional[int] = None
    comment: Optional[str] = None

    class Config:
        from_attributes = True


# -----------------------------
# ADMIN STATS
# -----------------------------
class AdminStats(BaseModel):
    total_vehicles: int
    available_now: int
    active_bookings: int
    pending_bookings: int
