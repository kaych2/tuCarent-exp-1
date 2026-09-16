from database import SessionLocal
from models import Vehicle

def reduce_vehicles():
    db = SessionLocal()
    vehicles = db.query(Vehicle).order_by(Vehicle.id.asc()).all()
    if len(vehicles) > 5:
        for v in vehicles[5:]:
            db.delete(v)
        db.commit()
        print(f"Deleted {len(vehicles) - 5} vehicles. Kept 5.")
    else:
        print("Already 5 or fewer vehicles.")
    db.close()

if __name__ == "__main__":
    reduce_vehicles()
