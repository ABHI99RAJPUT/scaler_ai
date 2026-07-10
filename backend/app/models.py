from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class HostedZone(Base):
    __tablename__ = "hosted_zones"

    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    name = Column(String, index=True)
    caller_reference = Column(String, unique=True, index=True, default=generate_uuid)
    type = Column(String, default="Public") # Public or Private
    comment = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    records = relationship("DnsRecord", back_populates="zone", cascade="all, delete-orphan")

class DnsRecord(Base):
    __tablename__ = "dns_records"

    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    zone_id = Column(String, ForeignKey("hosted_zones.id", ondelete="CASCADE"))
    name = Column(String, index=True)
    type = Column(String) # A, AAAA, CNAME, TXT, etc.
    value = Column(String) # For multiple values, we can store them comma-separated or JSON
    ttl = Column(Integer, default=300)
    routing_policy = Column(String, default="Simple")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    zone = relationship("HostedZone", back_populates="records")
