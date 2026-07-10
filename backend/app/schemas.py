from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- Auth Schemas ---
class UserCreate(BaseModel):
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    username_or_email: str
    password: str

class User(BaseModel):
    id: str
    email: str
    username: str
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# --- Hosted Zone Schemas ---
class HostedZoneBase(BaseModel):
    name: str
    type: str = "Public"
    comment: Optional[str] = None

class HostedZoneCreate(HostedZoneBase):
    pass

class HostedZone(HostedZoneBase):
    id: str
    caller_reference: str
    created_at: datetime
    record_count: int = 0

    class Config:
        from_attributes = True

# --- DNS Record Schemas ---
class DnsRecordBase(BaseModel):
    name: str
    type: str
    value: str
    ttl: int = 300
    routing_policy: str = "Simple"

class DnsRecordCreate(DnsRecordBase):
    pass

class DnsRecord(DnsRecordBase):
    id: str
    zone_id: str
    created_at: datetime

    class Config:
        from_attributes = True
