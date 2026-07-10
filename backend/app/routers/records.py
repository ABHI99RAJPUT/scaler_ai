from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models
from ..database import get_db
from ..auth import get_current_user

router = APIRouter(
    prefix="/hostedzone/{zone_id}/rrset",
    tags=["records"]
)


def _get_owned_zone(zone_id: str, current_user: models.User, db: Session) -> models.HostedZone:
    """Helper: fetch a zone that belongs to the current user, or raise 404."""
    zone = db.query(models.HostedZone).filter(
        models.HostedZone.id == zone_id,
        models.HostedZone.user_id == current_user.id
    ).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Hosted zone not found")
    return zone


@router.get("", response_model=List[schemas.DnsRecord])
def get_records(
    zone_id: str,
    skip: int = 0,
    limit: int = 100,
    search: str = "",
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    _get_owned_zone(zone_id, current_user, db)
    query = db.query(models.DnsRecord).filter(models.DnsRecord.zone_id == zone_id)
    if search:
        query = query.filter(models.DnsRecord.name.contains(search))
    return query.offset(skip).limit(limit).all()


@router.post("", response_model=schemas.DnsRecord)
def create_record(
    zone_id: str,
    record: schemas.DnsRecordCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    _get_owned_zone(zone_id, current_user, db)
    db_record = models.DnsRecord(**record.model_dump(), zone_id=zone_id)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


@router.delete("/{record_id}")
def delete_record(
    zone_id: str,
    record_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    zone = _get_owned_zone(zone_id, current_user, db)
    record = db.query(models.DnsRecord).filter(
        models.DnsRecord.id == record_id,
        models.DnsRecord.zone_id == zone_id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    # Prevent deleting default SOA or NS records
    if record.type in ["SOA", "NS"] and record.name == zone.name:
        raise HTTPException(status_code=400, detail="Cannot delete default SOA or NS record")

    db.delete(record)
    db.commit()
    return {"message": "Record deleted"}


@router.put("/{record_id}", response_model=schemas.DnsRecord)
def update_record(
    zone_id: str,
    record_id: str,
    record_update: schemas.DnsRecordCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    _get_owned_zone(zone_id, current_user, db)
    record = db.query(models.DnsRecord).filter(
        models.DnsRecord.id == record_id,
        models.DnsRecord.zone_id == zone_id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    for key, value in record_update.model_dump().items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)
    return record
