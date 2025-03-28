from functools import wraps
from flask import request, jsonify, current_app
import jwt
from app.services.firebase_service import get_user_by_id

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            # Decode token
            data = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            current_user = get_user_by_id(data['userId'])
            
            if not current_user:
                return jsonify({'message': 'Invalid token'}), 401
            
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        
        # Pass current user to the function
        return f(current_user, *args, **kwargs)
    
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user['userType'] != 'admin':
            return jsonify({'message': 'Admin privileges required'}), 403
        
        return f(current_user, *args, **kwargs)
    
    return decorated

def teacher_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user['userType'] != 'teacher' and current_user['userType'] != 'admin':
            return jsonify({'message': 'Teacher privileges required'}), 403
        
        return f(current_user, *args, **kwargs)
    
    return decorated
