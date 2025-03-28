from flask import Blueprint, request, jsonify
import jwt
import datetime
import bcrypt
from app.services.auth_service import verify_user, create_user, get_user_by_email
from app.middleware.auth_middleware import token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    if not data or not data.get('email') or not data.get('password') or not data.get('userType'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    email = data.get('email')
    password = data.get('password')
    user_type = data.get('userType')
    name = data.get('name', '')
    
    # Check if user already exists
    existing_user = get_user_by_email(email)
    if existing_user:
        return jsonify({'message': 'User already exists'}), 409
    
    # Create new user
    try:
        user_id = create_user(email, password, user_type, name)
        return jsonify({
            'message': 'User registered successfully',
            'userId': user_id
        }), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
    
    email = data.get('email')
    password = data.get('password')
    
    # Verify user
    user = verify_user(email, password)
    if not user:
        return jsonify({'message': 'Invalid credentials'}), 401
    
    # Generate JWT token
    token = jwt.encode({
        'userId': user['id'],
        'email': user['email'],
        'userType': user['userType'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, auth_bp.config['JWT_SECRET_KEY'])
    
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'name': user.get('name', ''),
            'userType': user['userType']
        }
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({
        'id': current_user['id'],
        'email': current_user['email'],
        'name': current_user.get('name', ''),
        'userType': current_user['userType']
    }), 200
