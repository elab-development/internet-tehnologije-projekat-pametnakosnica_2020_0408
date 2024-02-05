from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, abort, jsonify
)
from flask_bcrypt import Bcrypt
from application.models import *
from application.extensions import bcrypt, jwt
from sqlalchemy import or_
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, jwt_required
from application.config import ApplicationConfig
from application.extensions import jwt, jwt_redis_blocklist

from datetime import timedelta, datetime
import random
import math

bp = Blueprint('beehive', __name__, url_prefix='/apiary/beehive')

@bp.route('/create/<page>', methods=["POST"])
@jwt_required()
def create_apiary(page):
    try:
        page = int(page)
    except ValueError:
        return jsonify({"message": "Invalid apiary."}), 400
    
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"message": "User not found."}), 404
    
    apiary = Apiary.query.filter_by(user=user).offset(page - 1).limit(1).first()

    device = request.json['device']
    displayname = request.json['displayname']

    if not (device and displayname):
        return jsonify({"message": "Names of the device and beehive are required fields."}), 400

    new_beehive = Beehive(
        device=device,
        displayname=displayname,
        apiary=apiary
    )

    db.session.add(new_beehive)
    db.session.commit()

    return jsonify({"message": "Beehive added successfully."})

@bp.route('/add_measurement', methods=["POST"])
def add_measurement():
    beehive = Beehive.query.get("b3fa6c64850a44cf919862de6e53103d")

    if not beehive:
        return jsonify({"message": "Beehive not found."}), 404

    current_time = datetime.utcnow()  # Current UTC time
    beehive_measurements = []
    for i in range(50):
        date = current_time - timedelta(hours=i)
        temperature = random.uniform(9, 32)
        humidity = random.uniform(70, 90)  # High humidity
        air_pressure = random.uniform(1000, 1020)
        weight = random.uniform(10, 50)
        food_remaining = random.uniform(1, 3)

        measurement = Beehive_Measurement(
            date=date,
            temperature=temperature,
            humidity=humidity,
            air_pressure=air_pressure,
            weight=weight,
            food_remaining=food_remaining,
            beehive=beehive
        )
        beehive_measurements.append(measurement)
            
    db.session.add_all(beehive_measurements)
    db.session.commit()

    return jsonify({"message": "Beehive measurements added successfully."})

@bp.route('/get_beehives/<page>', methods=["GET"])
@jwt_required()
def get_beehives(page):
    try:
        page = int(page)
    except ValueError:
        return jsonify({"message": "Invalid apiary."}), 400
    
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"message": "User not found."}), 404
    
    apiary = Apiary.query.filter_by(user=user).offset(page - 1).limit(1).first()
    beehives = (
        Beehive.query
        .filter_by(apiary=apiary)
        .all()
    )
    
    beehives_data = [
        {
            "id": beehive.id,
            "device": beehive.device,
            "displayname": beehive.displayname
        }
        for beehive in beehives
    ]

    return jsonify({
        "beehives": beehives_data
    }), 200
    
@bp.route('/get_measurements/<apiary>/<beehive>', methods=["GET"])
@jwt_required()
def get_beehive_measurements(apiary, beehive):
    if apiary and beehive:
        try:
            apiary = int(apiary)
            beehive = int(beehive)
        except ValueError:
            return jsonify({"message": "Invalid page number."}), 400
    else: return jsonify({"message": "Invalid page number."}), 400
    
    user_email = get_jwt_identity()
    print(user_email)
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"message": "User not found."}), 404
    
    apiary = Apiary.query.filter_by(user=user).offset(apiary - 1).limit(1).first()
    if not apiary:
        apiary = Apiary.query.first()
        return jsonify({"message": "No more data available.", "status": 204}), 204
    print(apiary.id)
    beehive = Beehive.query.filter_by(apiary=apiary).offset(beehive - 1).limit(1).first()
    print(beehive.id)
    last_measurements = (
        Beehive_Measurement.query
        .filter_by(beehive=beehive)
        .limit(24)
        .all()
    )
    
    beehives_data = [
        {
            "id": m.id,
            "date": m.date.strftime('%H:%M'),
            "temperature": round(float(m.temperature), 2),
            "humidity": round(float(m.humidity), 2),
            "air_pressure": round(float(m.air_pressure), 2),
            "weight": round(float(m.weight), 2),
            "food_remaining": round(float(m.food_remaining), 2)
        }
        for m in last_measurements
    ]

    print("????????????????????????????? "+str(len(beehives_data)))
    
    return jsonify({
        "beehive": {
            "device": beehive.device,
            "displayname": beehive.displayname
            },
        "beehive_measurements": beehives_data
    }), 200