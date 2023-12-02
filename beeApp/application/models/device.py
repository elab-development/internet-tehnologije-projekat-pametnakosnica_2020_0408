from application.db import db

class Device(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    devicename = db.Column(db.String(50), unique=True)
    displayname = db.Column(db.String(50))