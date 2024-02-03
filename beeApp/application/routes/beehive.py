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

@bp.route('/create', methods=["POST"])
def create_apiary():
    apiary_id = 'f2904288959948c6ab094e650986950d'
    apiary = Apiary.query.get(apiary_id)

    # Create a new Apiary instance
    new_beehive = Beehive(
        device='ESP32',
        displayname='B4',
        apiary=apiary
    )

    # Add the Apiary instance to the session
    db.session.add(new_beehive)

    # Commit the changes to persist them in the database
    db.session.commit()

    return jsonify({"message": "Beehive added successfully."})

@bp.route('/addMeasurement', methods=["POST"])
def add_measurement():
    beehive = Beehive.query.get("028d8710e93247e996a24c56dcbe1f8b")

    if not beehive:
        return jsonify({"message": "Beehive not found."}), 404

    spring_start_date = datetime(2023, 3, 1, 0, 0, 0)
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
            beehive_id="your_beehive_id"  # Replace with the actual beehive ID
        )
        beehive_measurements.append(measurement)
            
    db.session.add_all(beehive_measurements)
    db.session.commit()

    return jsonify({"message": "Beehive measurements added successfully."})

@bp.route('/get_beehives/<page>', methods=["GET"])
def get_beehives(page):
    try:
        page = int(page)
    except ValueError:
        return jsonify({"message": "Invalid page number."}), 400
    
    apiary = Apiary.query.offset(page - 1).limit(1).first()
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