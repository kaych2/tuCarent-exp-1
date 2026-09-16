from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

# -----------------------------
#   USERS
# -----------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # customer | chauffeur
    role = Column(String, default="customer", nullable=False)
    phone = Column(String, nullable=True)

    bookings = relationship("Booking", back_populates="user")
    chauffeur_profile = relationship("Chauffeur", back_populates="user", uselist=False)


# -----------------------------
#   VEHICLES (Fleet)
# -----------------------------
class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)

    make = Column(String, nullable=False)
    model = Column(String, nullable=False)
    year = Column(Integer, nullable=True)
    type = Column(String, nullable=True)  # Sedan, SUV, etc.
    color = Column(String, nullable=True)

    daily_rate = Column(Float, nullable=False)
    mileage = Column(Integer, default=0)

    # available | rented | maintenance
    availability = Column(String, server_default="available", nullable=False)

    # basic fleet tracking
    accidents = Column(Integer, default=0)
    service_records = Column(Integer, default=0)
    rating = Column(Float, default=0.0)

    img = Column(String, nullable=True)

    bookings = relationship("Booking", back_populates="vehicle")
    maintenance_records = relationship("Maintenance", back_populates="vehicle")


# -----------------------------
#   CHAUFFEURS
# -----------------------------
class Chauffeur(Base):
    __tablename__ = "chauffeurs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=True)

    name = Column(String, nullable=False)
    license_number = Column(String, nullable=False)
    experience_years = Column(Integer, default=0)

    # per-day cost for chauffeur service
    daily_rate = Column(Float, default=20.0)

    rating = Column(Float, default=0.0)
    # available | assigned | off_duty
    status = Column(String, default="available")

    user = relationship("User", back_populates="chauffeur_profile")
    bookings = relationship("Booking", back_populates="chauffeur")


# -----------------------------
#   BOOKINGS (Rentals)
# -----------------------------
class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    chauffeur_id = Column(Integer, ForeignKey("chauffeurs.id"), nullable=True)

    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)

    # self-drive | chauffeur
    service_type = Column(String, default="self-drive", nullable=False)

    pickup_location = Column(String, nullable=True)
    pickup_time = Column(String, nullable=True)
    custom_color = Column(String, nullable=True)

    total_cost = Column(Float, default=0.0)

    # pending | confirmed | completed | cancelled
    status = Column(String, default="pending", nullable=False)

    user = relationship("User", back_populates="bookings")
    vehicle = relationship("Vehicle", back_populates="bookings")
    chauffeur = relationship("Chauffeur", back_populates="bookings")
    review = relationship("Review", back_populates="booking", uselist=False)


# -----------------------------
#   MAINTENANCE
# -----------------------------
class Maintenance(Base):
    __tablename__ = "maintenance"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)

    date = Column(Date, nullable=False)
    description = Column(Text, nullable=False)
    cost = Column(Float, default=0.0)

    # scheduled | completed
    status = Column(String, default="scheduled", nullable=False)

    vehicle = relationship("Vehicle", back_populates="maintenance_records")


# -----------------------------
#   REVIEWS
# -----------------------------
class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), unique=True, nullable=False)

    car_rating = Column(Integer, nullable=True)
    chauffeur_rating = Column(Integer, nullable=True)
    comment = Column(Text, nullable=True)

    booking = relationship("Booking", back_populates="review")
