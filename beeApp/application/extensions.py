from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_session import Session

migrate = Migrate()
bcrypt = Bcrypt()
server_session = Session()