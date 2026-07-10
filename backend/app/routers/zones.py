from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models
from ..database import get_db
from ..auth import get_current_user
from sqlalchemy import func

router = APIRouter(
    prefix="/hostedzone",
    tags=["hostedzone"]
)


@router.post("", response_model=schemas.HostedZone)
def create_hosted_zone(
    zone: schemas.HostedZoneCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_zone = models.HostedZone(**zone.model_dump(), user_id=current_user.id)
    db.add(db_zone)
    db.commit()
    db.refresh(db_zone)
    # Add SOA and NS default records
    soa_record = models.DnsRecord(zone_id=db_zone.id, name=db_zone.name, type="SOA", value="ns-1.awsdns.com. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400")
    ns_record = models.DnsRecord(zone_id=db_zone.id, name=db_zone.name, type="NS", value="ns-1.awsdns.com.\nns-2.awsdns.net.\nns-3.awsdns.org.\nns-4.awsdns.co.uk.")
    db.add(soa_record)
    db.add(ns_record)
    db.commit()
    db_zone.record_count = 2
    return db_zone


@router.get("", response_model=List[schemas.HostedZone])
def get_hosted_zones(
    skip: int = 0,
    limit: int = 100,
    search: str = "",
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    query = db.query(models.HostedZone).filter(models.HostedZone.user_id == current_user.id)
    if search:
        query = query.filter(models.HostedZone.name.contains(search))
    zones = query.offset(skip).limit(limit).all()

    # Calculate record count
    for zone in zones:
        zone.record_count = db.query(func.count(models.DnsRecord.id)).filter(models.DnsRecord.zone_id == zone.id).scalar()

    return zones


@router.get("/{zone_id}", response_model=schemas.HostedZone)
def get_hosted_zone(
    zone_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    zone = db.query(models.HostedZone).filter(
        models.HostedZone.id == zone_id,
        models.HostedZone.user_id == current_user.id
    ).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Hosted zone not found")
    zone.record_count = db.query(func.count(models.DnsRecord.id)).filter(models.DnsRecord.zone_id == zone.id).scalar()
    return zone


@router.delete("/{zone_id}")
def delete_hosted_zone(
    zone_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    zone = db.query(models.HostedZone).filter(
        models.HostedZone.id == zone_id,
        models.HostedZone.user_id == current_user.id
    ).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Hosted zone not found")
    db.delete(zone)
    db.commit()
    return {"message": "Hosted zone deleted"}
