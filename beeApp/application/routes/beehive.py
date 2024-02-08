from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, abort, jsonify
)
from flask_bcrypt import Bcrypt
from application.models import *
from application.extensions import bcrypt, jwt
from sqlalchemy import or_, desc
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
            "device": beehive.device
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