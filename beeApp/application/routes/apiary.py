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
def create_apiary():
    user_id = '1bb0bd51c27b4fe3bfc74a7647e35b48'
    user = User.query.get(user_id)

    # Create a new Apiary instance
    new_apiary = Apiary(
        name='Caljinci',
        location='Svodje',
        user=user
    )

    # Add the Apiary instance to the session
    db.session.add(new_apiary)

    # Commit the changes to persist them in the database
    db.session.commit()

    return jsonify({"message": "Apiary added successfully."})

@bp.route('/addMeasurement', methods=["POST"])
def add_measurement():
    # Retrieve the Apiary
    apiary = Apiary.query.get("f6140f8236904a8ab13f783fcd5d0c78")

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
def get_last_measurements(page):
    try:
        page = int(page)
    except ValueError:
        return jsonify({"message": "Invalid page number."}), 400
    
    apiary = Apiary.query.offset(page - 1).limit(1).first()
    status_code = 200
    if not apiary:
        apiary = Apiary.query.first()
        return jsonify({"message": "No more data available.", "status": 204}), 204
    
    last_24_hours = datetime.utcnow() - timedelta(hours=24)

    last_measurements = (
        Apiary_Measurement.query
        .filter_by(apiary=apiary)
        # # .filter(Apiary_Measurement.date >= last_24_hours)
        # .order_by(Apiary_Measurement.date.desc())
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