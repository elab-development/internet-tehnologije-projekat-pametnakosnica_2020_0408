from application.database import db
from uuid import uuid4

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__="user"
    id = db.Column(db.String(32), unique=True, primary_key=True, default=get_uuid)
    firstname = db.Column(db.String(20), nullable=False)
    lastname = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(345), nullable=False)
    username = db.Column(db.String(20), unique=True)
    password = db.Column(db.String(72), nullable=False)
    
class Beehive(db.Model):
    __tablename__="beehive"
    id = db.Column(db.String(32), unique=True, primary_key=True, default=get_uuid)
    devicename = db.Column(db.String(50), unique=True)
    displayname = db.Column(db.String(50), nullable=False)
    
class UserBeehive(db.Model):
    __tablename__="userbeehive"
    user_id = db.Column(db.String(32), db.ForeignKey('user.id'), primary_key=True, nullable=False)
    user = db.relationship("User")
    device_id = db.Column(db.String(32), db.ForeignKey('beehive.id'), primary_key=True, nullable=False)
    beehive = db.relationship("Beehive")
    date = db.Column(db.DateTime, nullable=False)
    
    
    