from flask import Blueprint, request, jsonify
from app.middleware.auth_middleware import token_required, admin_required
from app.services.firebase_service import get_all_users, get_user_by_id, update_user, delete_user

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'])
@token_required
@admin_required
def get_users():
    try:
        users = get_all_users()
        return jsonify(users), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@users_bp.route('/<user_id>', methods=['GET'])
@token_required
def get_user(current_user, user_id):
    # Only allow users to get their own data unless admin
    if current_user['userType'] != 'admin' and current_user['id'] != user_id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    try:
        user = get_user_by_id(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify(user), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@users_bp.route('/<user_id>', methods=['PUT'])
@token_required
def update_user_data(current_user, user_id):
    # Only allow users to update their own data unless admin
    if current_user['userType'] != 'admin' and current_user['id'] != user_id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    # Don't allow updating email or userType through this endpoint
    if 'email' in data:
        del data['email']
    
    if 'userType' in data and current_user['userType'] != 'admin':
        del data['userType']
    
    try:
        updated_user = update_user(user_id, data)
        return jsonify(updated_user), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@users_bp.route('/<user_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_user_data(current_user, user_id):
    try:
        delete_user(user_id)
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
