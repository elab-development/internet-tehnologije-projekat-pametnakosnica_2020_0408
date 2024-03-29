from flask import Flask
from application.config import ApplicationConfig
from application.database import db
from application.extensions import migrate, bcrypt, server_session, cors, jwt, jwt_redis_blocklist

def create_app():
    app = Flask(__name__)
    app.config.from_object(ApplicationConfig)

    bcrypt.init_app(app)
    jwt.init_app(app)
    #zato sto imamo server-side session onda ce default flaskov session biti na serveru
    cors.init_app(app, supports_credentials=True)
    server_session.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    from application import models
    
    from application.routes import auth, apiary, beehive
    app.register_blueprint(auth.bp)
    app.register_blueprint(apiary.bp)
    app.register_blueprint(beehive.bp)

    return app