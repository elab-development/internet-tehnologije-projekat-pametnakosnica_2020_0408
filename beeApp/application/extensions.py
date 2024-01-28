from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_cors import CORS

migrate = Migrate()
bcrypt = Bcrypt()
server_session = Session()
cors = CORS()