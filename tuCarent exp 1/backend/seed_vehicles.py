from database import SessionLocal
from models import Vehicle

db = SessionLocal()

vehicles = [
    {"brand": "Tesla", "model": "Model S", "year": 2022, "type": "Electric", "price_per_day": 150, "img": "teslamodels.jpg"},
    {"brand": "Porsche", "model": "911 Carrera", "year": 2023, "type": "Sports", "price_per_day": 350, "img": "porsche911.jpg"},
    {"brand": "BMW", "model": "M4", "year": 2022, "type": "Sports", "price_per_day": 220, "img": "bmwm4.jpg"},
    {"brand": "Audi", "model": "RS7", "year": 2020, "type": "Luxury", "price_per_day": 250, "img": "audirs7.jpg"},
    {"brand": "Mercedes-Benz", "model": "S-Class", "year": 2023, "type": "Luxury", "price_per_day": 180, "img": "mercedesbenzsclass.jpg"},
    {"brand": "BMW", "model": "i8", "year": 2021, "type": "Sports", "price_per_day": 200, "img": "bmwi8.jpg"},
    
    {"brand": "Ford", "model": "Mustang", "year": 2024, "type": "Sports", "price_per_day": 160, "img": "fordmustang.jpg"},
    {"brand": "Jaguar", "model": "XJ", "year": 2020, "type": "Luxury", "price_per_day": 190, "img": "jaguarxj.jpg"},
    {"brand": "Mercedes-Benz", "model": "AMG C63", "year": 2023, "type": "Sports", "price_per_day": 280, "img": "mercedesbenzamgc63.jpg"},
    
    {"brand": "Toyota", "model": "Land Cruiser", "year": 2021, "type": "SUV", "price_per_day": 110, "img": "toyotalandcruiser79series.jpg"},
    {"brand": "Mercedes-Benz", "model": "GLE", "year": 2022, "type": "SUV", "price_per_day": 140, "img": "mercedesbenzgle.jpg"},
    {"brand": "Ford", "model": "F150", "year": 2023, "type": "Trucks", "price_per_day": 130, "img": "fordf150.jpeg"},
    {"brand": "Nissan", "model": "Navara", "year": 2021, "type": "Trucks", "price_per_day": 100, "img": "nissannavara.jpg"},
    
    {"brand": "Toyota", "model": "Hiace", "year": 2020, "type": "Vans/MPVs", "price_per_day": 80, "img": "toyotahiace.jpg"},
    {"brand": "Mercedes-Benz", "model": "V-Class", "year": 2021, "type": "Vans/MPVs", "price_per_day": 160, "img": "mercedesbenzvclass.jpg"},
    {"brand": "Toyota", "model": "Noah", "year": 2021, "type": "Vans/MPVs", "price_per_day": 70, "img": "to yotanoah.jpg"},
    
    {"brand": "Mazda", "model": "Demio", "year": 2019, "type": "Economy", "price_per_day": 50, "img": "mazdademio.jpg"},
    {"brand": "Toyota", "model": "Vitz", "year": 2017, "type": "Economy", "price_per_day": 40, "img": "toyotavitz.jpg"},
    {"brand": "Nissan", "model": "Note", "year": 2018, "type": "Economy", "price_per_day": 45, "img": "nissannote.jpg"}
]

for v in vehicles:
    vehicle = Vehicle(**v)
    db.add(vehicle)

db.commit()
db.close()

print("✔ Vehicle seeding complete.")
