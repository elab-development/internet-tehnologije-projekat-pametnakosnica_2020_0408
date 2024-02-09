from flask import (
    Blueprint, request, jsonify
)
from application.models import *
from flask_jwt_extended import get_jwt_identity, jwt_required
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
    data = request.json
    apiary_id = data.get('apiary_id')
    temperature = data.get('temperature')
    humidity = data.get('humidity')
    air_pressure = data.get('air_pressure')

    if not (apiary_id and temperature and humidity and air_pressure):
        return jsonify({'message': 'Missing required fields.'}), 400

    apiary = Apiary.query.get(apiary_id)
    if not apiary:
        return jsonify({'message': 'Apiary not found.'}), 404

    measurement = Apiary_Measurement(
        date=datetime.now(),
        temperature=temperature,
        humidity=humidity,
        air_pressure=air_pressure,
        apiary=apiary
    )
    
    db.session.add(measurement)
    db.session.commit()

    return jsonify({'message': 'Measurement added successfully.'}), 201


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
        return jsonify({"message": "Apiary deleted successfully"}), 200
    else:
        return jsonify({"message": "Apiary not found"}), 404