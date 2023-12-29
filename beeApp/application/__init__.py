from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from application.db import db

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.sqlite'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    from . import db

    db.init_app(app)
    migrate = Migrate(app, db)
    
    from application.models.user import User
    from application.models.device import Device
    from application.models.connection import Connection


    return app