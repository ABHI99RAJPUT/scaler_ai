from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import zones, records, auth

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Route53 Clone API",
    description="API for managing Mock Route53 Hosted Zones and DNS Records",
    version="1.0.0"
)

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","https://scaler-cot51268j-abhi-99.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(zones.router)
app.include_router(records.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Route53 Clone API"}
