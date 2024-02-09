from application.database import db
from uuid import uuid4

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.String(32), unique=True, primary_key=True, default=get_uuid)
    firstname = db.Column(db.String(20), nullable=False)
    lastname = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(254), nullable=False)
    username = db.Column(db.String(20), unique=True)
    password = db.Column(db.String(72), nullable=False)
    banned = db.Column(db.Boolean, nullable=False, server_default='0')
    role_id = db.Column(db.String(32), db.ForeignKey('role.id'), nullable=False, default='80418e527e914d5aafc8a8c8e4efa78d')
    apiaries = db.relationship("Apiary", back_populates="user")
    role = db.relationship("Role")

class Apiary(db.Model):
    __tablename__ = "apiary"
    id = db.Column(db.String(32), unique=True, primary_key=True, default=get_uuid)
    name = db.Column(db.String(20), nullable=False)
    location = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.String(32), db.ForeignKey('user.id'), nullable=False)
    user = db.relationship("User", back_populates="apiaries")
    beehives = db.relationship("Beehive", back_populates="apiary")
    measurements = db.relationship("Apiary_Measurement", back_populates="apiary")

class Beehive(db.Model):
    __tablename__ = "beehive"
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    device = db.Column(db.String(32), nullable=False)
    displayname = db.Column(db.String(50), nullable=False)
    apiary_id = db.Column(db.String(32), db.ForeignKey('apiary.id'), nullable=False)
    apiary = db.relationship("Apiary", back_populates="beehives")
    measurements = db.relationship("Beehive_Measurement", back_populates="beehive")

class Beehive_Measurement(db.Model):
    __tablename__ = "beehive_measurement"
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    date = db.Column(db.DateTime, nullable=False)
    temperature = db.Column(db.Numeric, default=0)
    humidity = db.Column(db.Numeric, default=0)
    air_pressure = db.Column(db.Numeric, default=0)
    weight = db.Column(db.Numeric, default=0)
    food_remaining = db.Column(db.Numeric, default=0)
    beehive_id = db.Column(db.String(32), db.ForeignKey('beehive.id'), nullable=False)
    beehive = db.relationship("Beehive", back_populates="measurements")
    
class Apiary_Measurement(db.Model):
    __tablename__ = "apiary_measurement"
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    date = db.Column(db.DateTime, nullable=False)
    temperature = db.Column(db.Numeric, default=0)
    humidity = db.Column(db.Numeric, default=0)
    air_pressure = db.Column(db.Numeric, default=0)
    apiary_id = db.Column(db.String(32), db.ForeignKey('apiary.id'), nullable=False)
    apiary = db.relationship("Apiary", back_populates="measurements")
    
class Role(db.Model):
    __tablename__ = "role"
    id = db.Column(db.String(32), unique=True, primary_key=True, default=get_uuid)
    rolename = db.Column(db.String(20), nullable=False)