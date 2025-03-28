from flask import Flask
from flask_cors import CORS
from app.config.settings import config

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    CORS(app)
    
    # Register blueprints
    from app.api.auth import auth_bp
    from app.api.users import users_bp
    from app.api.attendance import attendance_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
    
    # Register error handlers
    from app.utils.error_handlers import register_error_handlers
    register_error_handlers(app)
    
    return app
