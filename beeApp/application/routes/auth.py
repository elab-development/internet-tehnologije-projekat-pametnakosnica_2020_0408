from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, abort, jsonify
)
from flask_bcrypt import Bcrypt
from application.models import *
from application.extensions import bcrypt
from sqlalchemy import or_

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/@me')
def get_current_user():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    user = User.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "firstname": user.firstname,
        "lastname": user.lastname
    })

@bp.route('/register', methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]
    username = request.json["username"]
    firstname = request.json["firstname"]
    lastname = request.json["lastname"]
    
    user_exists = User.query.filter_by(email=email).first() is not None
    
    if user_exists:
        return jsonify({"error": "User already exists!"}), 409
    
    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password, username=username, firstname=firstname, lastname=lastname)
    
    db.session.add(new_user)
    db.session.commit()
    session["user_id"] = new_user.id
    
    return jsonify({
        "id": new_user.id,
        "email": new_user.email,
        "username": new_user.username,
        "firstname": new_user.firstname,
        "lastname": new_user.lastname
    })
    
@bp.route('/login', methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]
    # username = request.json["username"]
    
    # user = User.query.filter(or_(User.email == email, User.username == username)).first()
    user = User.query.filter_by(email=email).first()
    
    
    if user is None:
        return jsonify({"error": "Unauthorized"}), 401
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    session["user_id"] = user.id
    
    return jsonify({
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "firstname": user.firstname,
        "lastname": user.lastname
    })
    
@bp.route('/logout', methods=['POST'])
def logout_user():
    session.pop("user_id")
    return "200"