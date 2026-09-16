from database import SessionLocal
from models import Vehicle, User, Chauffeur
from auth import get_password_hash

db = SessionLocal()

# -------------------------
# Create default test customer
# -------------------------
cust_email = "customer@tucarent.com"
existing = db.query(User).filter_by(email=cust_email).first()
if not existing:
    user = User(
        name="Test Customer",
        email=cust_email,
        hashed_password=get_password_hash("password123"),
        role="customer",
        phone="+254700000001"
    )
    db.add(user)
    db.commit()
    print("Customer created:", cust_email)

# -------------------------
# Create default chauffeur user + profile
# -------------------------
ch_email = "chauffeur@tucarent.com"
ch_user = db.query(User).filter_by(email=ch_email).first()
if not ch_user:
    ch_user = User(
        name="Test Chauffeur",
        email=ch_email,
        hashed_password=get_password_hash("password123"),
        role="chauffeur",
        phone="+254700000002"
    )
    db.add(ch_user)
    db.commit()
    db.refresh(ch_user)
    print("Chauffeur user created:", ch_email)

profile = db.query(Chauffeur).filter_by(user_id=ch_user.id).first()
if not profile:
    profile = Chauffeur(
        user_id=ch_user.id,
        name="Test Chauffeur",
        license_number="CH-KE-123456",
        experience_years=5,
        daily_rate=25.0,
        status="available",
        rating=4.7
    )
    db.add(profile)
    db.commit()
    print("Chauffeur profile created for:", ch_email)

# -------------------------
# Seed vehicles
# -------------------------
vehicles = [
    ("Toyota", "Camry", 2023, "Sedan", "Black", 45, 12500),
    ("BMW", "X5", 2022, "SUV", "Black", 95, 28000),
    ("Tesla", "Model 3", 2024, "Sedan", "White", 85, 5200),
    ("Porsche", "911", 2023, "Sports", "Red", 350, 22000),
    ("Mazda", "Demio", 2019, "Economy", "Blue", 50, 68000),
]

added = 0
for make, model, year, type_, color, rate, mileage in vehicles:
    exists = db.query(Vehicle).filter_by(make=make, model=model, year=year).first()
    if exists:
        continue
    v = Vehicle(
        make=make,
        model=model,
        year=year,
        type=type_,
        color=color,
        daily_rate=rate,
        mileage=mileage,
        availability="available",
        accidents=0,
        service_records=0,
        rating=4.5,
        img=None
    )
    db.add(v)
    added += 1

db.commit()
print(f"{added} vehicles inserted successfully.")
