from flask import (
    Blueprint, request, session, jsonify
)
from application.models import *
from application.extensions import bcrypt, jwt
from sqlalchemy import or_
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, jwt_required
from application.extensions import jwt, jwt_redis_blocklist

bp = Blueprint('auth', __name__, url_prefix='/auth')

@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload: dict):
    jti = jwt_payload["jti"]
    token_in_redis = jwt_redis_blocklist.get(jti)
    return token_in_redis is not None

@bp.route('/login', methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]
    
    user = User.query.filter_by(email=email).first()
    
    if user is None:
        return jsonify({"msg": "Unauthorized"}), 401
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"msg": "Unauthorized"}), 401
    
    if user.banned:
        return jsonify({"msg": "Unauthorized"}), 401
    
    access_token = create_access_token(identity=email)
    
    return jsonify(access_token=access_token), 200

@bp.route('/@me')
@jwt_required()
def get_current_user():
    try:
        current_user_identity = get_jwt_identity()
        user = User.query.filter_by(email=str(current_user_identity)).first()
    except:
        return jsonify({"error": "User not found"}), 404
    
    if user:
        return jsonify({
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "firstname": user.firstname,
        "lastname": user.lastname,
        "rolename": user.role.rolename
        }), 200
    else:
        return jsonify({"error": "User not found"}), 404

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

@bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout_user():
    jti = get_jwt()["jti"]
    jwt_redis_blocklist.set(jti, "")
    return jsonify(msg="Access token revoked")

@bp.route('/admin', methods=["GET"])
@jwt_required()
def admin():
    try:
        current_user_identity = get_jwt_identity()
        user = User.query.filter_by(email=str(current_user_identity)).first()
    except:
        return jsonify({"error": "User not found"}), 404
    
    if Role.query.filter_by(id=user.role_id).first().rolename != "Administrator":
        return jsonify(msg="Unauthorized"), 401
    
    users = []
    for user in User.query.all():
        role = Role.query.filter_by(id=user.role_id).first()
        
        users.append({
            "banned": user.banned,
            "username": user.username,
            "email": user.email,
            "firstname": user.firstname,
            "lastname": user.lastname,
            "rolename": role.rolename,
        })
    
    return jsonify({
        "users": users
    }), 200
    
@bp.route('/admin/banstatus/<username>', methods=["PUT"])
@jwt_required()
def change_ban_status(username):
    try:
        username = str(username)
    except ValueError:
        return jsonify({"message": "Invalid username."}), 400
    
    try:
        current_user_identity = get_jwt_identity()
        user = User.query.filter_by(email=str(current_user_identity)).first()
    except:
        return jsonify({"error": "Current user not found"}), 404
    
    if Role.query.filter_by(id=user.role_id).first().rolename != "Administrator":
        return jsonify(msg="Unauthorized"), 401
    
    u = User.query.filter_by(username=username).first()
    if not u:
        return jsonify({"message": "Invalid username."}), 400
        
    if u.banned:
        u.banned = False
    else:
        u.banned = True
    
    db.session.commit()
    
    return jsonify(
        msg="success"
    ), 200
    
@bp.route('/admin/role/<username>', methods=["PUT"])
@jwt_required()
def set_role(username):
    try:
        username = str(username)
    except ValueError:
        return jsonify({"message": "Invalid username."}), 400
    
    try:
        current_user_identity = get_jwt_identity()
        user = User.query.filter_by(email=str(current_user_identity)).first()
    except:
        return jsonify({"error": "Current user not found"}), 404
    
    if Role.query.filter_by(id=user.role_id).first().rolename != "Administrator":
        return jsonify(msg="Unauthorized"), 401
    
    u = User.query.filter_by(username=username).first()
    if not u:
        return jsonify({"message": "Invalid username."}), 400
    
    
    if u.role.rolename == "Beekeeper":
        u.role = Role.query.filter_by(rolename="Administrator").first()
    else:
        u.role = Role.query.filter_by(rolename="Beekeeper").first()
    
    db.session.commit()
    
    return jsonify(
        msg="success"
    ), 200

