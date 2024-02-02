from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_cors import CORS
import redis

migrate = Migrate()
bcrypt = Bcrypt()
server_session = Session()
cors = CORS()
jwt = JWTManager()
jwt_redis_blocklist = redis.StrictRedis(
    host="127.0.0.1", port=6379, db=0, decode_responses=True
)