from flask import Flask
from application.config import ApplicationConfig
from application.database import db
from application.extensions import migrate, bcrypt, server_session

def create_app():
    app = Flask(__name__)
    app.config.from_object(ApplicationConfig)

    bcrypt.init_app(app)
    
    #zato sto imamo server-side session onda ce default flaskov session biti na serveru
    server_session.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    from application import models
    
    from application.routes import auth
    app.register_blueprint(auth.bp)

    return app