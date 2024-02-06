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

bp = Blueprint('apiary', __name__, url_prefix='/apiary')

@bp.route('/create', methods=["POST"])
@jwt_required()
def create_apiary():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"message": "User not found."}), 404

    data = request.json
    name = data.get("name")
    location = data.get("location")

    if not (name and location):
        return jsonify({"message": "Name and location are required fields."}), 400

    new_apiary = Apiary(
        name=name,
        location=location,
        user=user
    )

    db.session.add(new_apiary)
    db.session.commit()

    return jsonify({"message": "Apiary created successfully."}), 200

@bp.route('/addMeasurement', methods=["POST"])
def add_measurement():
    apiary = Apiary.query.get("f2904288959948c6ab094e650986950d")

    if not apiary:
        return jsonify({"message": "Apiary not found."}), 404

    spring_start_date = datetime(2023, 3, 1, 0, 0, 0)
    
    apiary_measurements = []
    for j in range(1, 3):
        for i in range(50):
            date = spring_start_date + timedelta(hours=i)
            temperature_variation = 5 * math.sin((2 * math.pi / 24) * date.hour)
            temperature = random.uniform(15, 25) + temperature_variation
            humidity = random.uniform(40, 70)
            air_pressure = random.uniform(1000, 1020)

            measurement = Apiary_Measurement(
                date=date,
                temperature=temperature,
                humidity=humidity,
                air_pressure=air_pressure,
                apiary=apiary
            )
            apiary_measurements.append(measurement)
            
    db.session.add_all(apiary_measurements)
    db.session.commit()

    return jsonify({"message": "Apiary measurements added successfully."})

@bp.route('/get_measurements/<page>', methods=["GET"])
@jwt_required()
def get_last_measurements(page):
    try:
        page = int(page)
    except ValueError:
        return jsonify({"message": "Invalid page number."}), 400
    
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"message": "User not found."}), 404
    
    apiary = Apiary.query.filter_by(user=user).offset(page - 1).limit(1).first()
    if not apiary:
        apiary = Apiary.query.first()
        return jsonify({"message": "No more data available.", "status": 204}), 204

    last_measurements = (
        Apiary_Measurement.query
        .filter_by(apiary=apiary)
        .limit(24)
        .all()
    )

    apiary_data = {
        "name": apiary.name,
        "location": apiary.location
    }
    
    measurements_data = [
        {
            "id": measurement.id,
            "date": measurement.date.strftime('%H:%M'),
            "temperature": round(float(measurement.temperature), 2),
            "humidity": round(float(measurement.humidity), 2),
            "air_pressure": round(float(measurement.air_pressure), 2),
        }
        for measurement in last_measurements
    ]

    return jsonify({
        "apiary": apiary_data,
        "measurements": measurements_data
    }), 200
    
@bp.route('/edit/<apiary>', methods=["PUT"])
@jwt_required()
def edit_apiary(apiary):
    if apiary:
        try:
            apiary = int(apiary)
        except ValueError:
            return jsonify({"message": "Invalid page number."}), 400
    else: return jsonify({"message": "Invalid page number."}), 400
    
    new_name = request.json['name']
    new_location = request.json['location']
    
    if not (new_name and new_location):
        return jsonify({"message": "Name and location are required fields."}), 400
    
    user_email = get_jwt_identity()

    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"message": "User not found."}), 404
    
    apiary = Apiary.query.filter_by(user=user).offset(apiary - 1).limit(1).first()
    if not apiary:
        apiary = Apiary.query.first()
        return jsonify({"message": "No more data available.", "status": 204}), 204

    apiary.name = new_name
    apiary.location = new_location
    
    db.session.commit()
    
    return jsonify({"message": "Apiary updated successfully."}), 200

@bp.route('/delete/<apiary>', methods=["DELETE"])
@jwt_required()
def delete_apiary(apiary):
    if apiary:
        try:
            apiary = int(apiary)
        except ValueError:
            return jsonify({"message": "Invalid page number."}), 400
    else: return jsonify({"message": "Invalid page number."}), 400
    
    user_email = get_jwt_identity()

    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"message": "User not found."}), 404
    
    apiary = Apiary.query.filter_by(user=user).offset(apiary - 1).limit(1).first()   
    if apiary:
        db.session.delete(apiary)
        db.session.commit()
        return jsonify({"message": "Beehive deleted successfully"}), 200
    else:
        return jsonify({"message": "Beehive not found"}), 404