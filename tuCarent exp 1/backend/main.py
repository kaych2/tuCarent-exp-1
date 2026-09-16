from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routes import users, vehicles, bookings, chauffeur, chauffeurs
from routes import admin



# ensure tables exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="tuCarent - Smart Car Rental & Chauffeur Management API",
    version="1.0.0",
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(vehicles.router)
app.include_router(bookings.router)
app.include_router(admin.router)
app.include_router(chauffeur.router)
app.include_router(chauffeurs.router)

@app.get("/")
def read_root():
    return {"message": "tuCarent API. Visit /docs for API documentation."}