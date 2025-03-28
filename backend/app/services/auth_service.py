import bcrypt
from app.services.firebase_service import get_user_by_email as get_firebase_user
from app.services.firebase_service import create_user as create_firebase_user

def verify_user(email, password):
    """Verify user credentials"""
    user = get_firebase_user(email)
    
    if not user:
        return None
    
    # Check password
    if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return user
    
    return None

def create_user(email, password, user_type, name=''):
    """Create a new user"""
    # Hash password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Create user in Firebase
    user_data = {
        'email': email,
        'password': hashed_password,
        'userType': user_type,
        'name': name
    }
    
    user_id = create_firebase_user(user_data)
    return user_id

def get_user_by_email(email):
    """Get user by email"""
    return get_firebase_user(email)
