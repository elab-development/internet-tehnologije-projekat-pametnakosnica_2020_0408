from flask import (
    Blueprint, request, jsonify
)
from application.models import *
from sqlalchemy import or_, desc
from flask_jwt_extended import get_jwt_identity, jwt_required
from datetime import timedelta, datetime
import random

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

from flask import request, jsonify
from datetime import datetime

@bp.route('/add_measurement', methods=["POST"])
def add_measurement():
    data = request.json
    beehive_id = data.get('beehive_id')
    temperature = data.get('temperature')
    humidity = data.get('humidity')
    air_pressure = data.get('air_pressure')
    weight = data.get('weight')
    food_remaining = data.get('food_remaining')

    if not (beehive_id and temperature and humidity and air_pressure and weight and food_remaining):
        return jsonify({'message': 'Missing required fields.'}), 400

    beehive = Beehive.query.get(beehive_id)
    if not beehive:
        return jsonify({'message': 'Beehive not found.'}), 404

    measurement = Beehive_Measurement(
        date=datetime.now(),
        temperature=temperature,
        humidity=humidity,
        air_pressure=air_pressure,
        weight=weight,
        food_remaining=food_remaining,
        beehive=beehive
    )

    db.session.add(measurement)
    db.session.commit()

    return jsonify({'message': 'Measurement added successfully.'}), 201

@bp.route('/get_beehives/<ap>/<page>', methods=["GET"])
@jwt_required()
def get_beehives(ap, page):
    search_query = request.args.get('search')  # Get the search query from the request
    try:
        ap = int(ap)
        page = int(page)
    except ValueError:
        return jsonify({"message": "Invalid apiary."}), 400
    
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"message": "User not found."}), 404
    
    apiary = Apiary.query.filter_by(user=user).offset(ap - 1).limit(1).first()
    
    beehives_query = Beehive.query.filter_by(apiary=apiary)
    
    if search_query:
        beehives_query = beehives_query.filter(or_(
            Beehive.device.ilike(f'%{search_query}%'),
            Beehive.displayname.ilike(f'%{search_query}%')
        ))
    
    beehives_query = beehives_query.offset((page - 1) * 8).limit(8)
    
    beehives = beehives_query.all()
    
    if not beehives:
        return jsonify({"message": "No data"}), 204
    
    beehives_data = []
    for beehive in beehives:
        latest_measurement = Beehive_Measurement.query.filter_by(beehive=beehive).order_by(desc(Beehive_Measurement.date)).first()
        
        if latest_measurement:
            beehives_data.append({
                "device": beehive.device,
                "displayname": beehive.displayname,
                "date": latest_measurement.date,
                "temperature": round(float(latest_measurement.temperature), 1),
                "humidity": round(float(latest_measurement.humidity), 2),
                "air_pressure": round(float(latest_measurement.air_pressure), 2),
                "weight": round(float(latest_measurement.weight), 2),
                "food_remaining": round(float(latest_measurement.food_remaining), 2)
            })
        else:
            beehives_data.append({
                "device": beehive.device,
                "displayname": beehive.displayname,
                "date": None,
                "temperature": None,
                "humidity": None,
                "air_pressure": None,
                "weight": None,
                "food_remaining": None
            })

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

    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"message": "User not found."}), 404
    
    apiary = Apiary.query.filter_by(user=user).offset(apiary - 1).limit(1).first()
    if not apiary:
        apiary = Apiary.query.first()
        return jsonify({"message": "No more data available.", "status": 204}), 204

    beehive = Beehive.query.filter_by(apiary=apiary).offset(beehive - 1).limit(1).first()

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
    
    return jsonify({
        "beehive": {
            "displayname": beehive.displayname,
            "device": beehive.device,
            "id": beehive.id
            },
        "beehive_measurements": beehives_data
    }), 200
    
@bp.route('/edit/<apiary>/<beehive>', methods=["PUT"])
@jwt_required()
def edit_beehive(apiary, beehive):
    if apiary and beehive:
        try:
            apiary = int(apiary)
            beehive = int(beehive)
        except ValueError:
            return jsonify({"message": "Invalid page number."}), 400
    else: return jsonify({"message": "Invalid page number."}), 400
    
    new_device = request.json['device']
    new_displayname = request.json['displayname']
    
    if not (new_device and new_displayname):
        return jsonify({"message": "Device and display name are required fields."}), 400
    
    user_email = get_jwt_identity()

    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"message": "User not found."}), 404
    
    apiary = Apiary.query.filter_by(user=user).offset(apiary - 1).limit(1).first()
    if not apiary:
        apiary = Apiary.query.first()
        return jsonify({"message": "No more data available."}), 204

    beehive = Beehive.query.filter_by(apiary=apiary).offset(beehive - 1).limit(1).first()
    
    beehive.device = new_device
    beehive.displayname = new_displayname
    
    db.session.commit()
    
    return jsonify({"message": "Beehive updated successfully."}), 200

@bp.route('/delete/<apiary>/<beehive>', methods=["DELETE"])
@jwt_required()
def delete_beehive(apiary, beehive):
    if apiary and beehive:
        try:
            apiary = int(apiary)
            beehive = int(beehive)
        except ValueError:
            return jsonify({"message": "Invalid page number."}), 400
    else: return jsonify({"message": "Invalid page number."}), 400
    
    user_email = get_jwt_identity()

    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"message": "User not found."}), 404
    
    apiary = Apiary.query.filter_by(user=user).offset(apiary - 1).limit(1).first()
    if not apiary:
        apiary = Apiary.query.first()
        return jsonify({"message": "No more data available."}), 204

    beehive = Beehive.query.filter_by(apiary=apiary).offset(beehive - 1).limit(1).first()
    
    if beehive:
        db.session.delete(beehive)
        db.session.commit()
        return jsonify({"message": "Beehive deleted successfully"}), 200
    else:
        return jsonify({"message": "Beehive not found"}), 404