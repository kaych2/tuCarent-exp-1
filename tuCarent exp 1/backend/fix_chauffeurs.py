"""
Fix chauffeurs stuck as 'assigned' when their bookings are completed/cancelled.
Sets them back to 'available' if they have no active pending/confirmed bookings.
"""
from database import SessionLocal
from models import Chauffeur, Booking
from sqlalchemy import and_

db = SessionLocal()

chauffeurs = db.query(Chauffeur).all()
fixed = 0

for c in chauffeurs:
    if c.status == "assigned":
        # Check if they have any active (pending/confirmed) booking
        active = db.query(Booking).filter(
            and_(
                Booking.chauffeur_id == c.id,
                Booking.status.in_(["pending", "confirmed"])
            )
        ).first()

        if not active:
            print(f"Resetting chauffeur '{c.name}' (id={c.id}) from 'assigned' -> 'available'")
            c.status = "available"
            fixed += 1

db.commit()
db.close()
print(f"\nDone. {fixed} chauffeur(s) reset to 'available'.")
