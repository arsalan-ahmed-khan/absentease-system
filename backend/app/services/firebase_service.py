import os
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

# Initialize Firebase Admin
try:
    # Use application default credentials
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred, {
        'projectId': os.environ.get('FIREBASE_PROJECT_ID'),
    })
except:
    # If running locally, use a service account
    if not firebase_admin._apps:
        # Check if credentials file exists
        if os.path.exists('firebase-credentials.json'):
            cred = credentials.Certificate('firebase-credentials.json')
            firebase_admin.initialize_app(cred)
        else:
            # Initialize without credentials
            firebase_admin.initialize_app()

db = firestore.client()

# User operations
def get_all_users():
    """Get all users"""
    users_ref = db.collection('users')
    docs = users_ref.stream()
    
    users = []
    for doc in docs:
        user_data = doc.to_dict()
        # Don't return password
        if 'password' in user_data:
            del user_data['password']
        user_data['id'] = doc.id
        users.append(user_data)
    
    return users

def get_user_by_id(user_id):
    """Get user by ID"""
    user_ref = db.collection('users').document(user_id)
    user = user_ref.get()
    
    if not user.exists:
        return None
    
    user_data = user.to_dict()
    # Don't return password
    if 'password' in user_data:
        del user_data['password']
    user_data['id'] = user.id
    
    return user_data

def get_user_by_email(email):
    """Get user by email"""
    users_ref = db.collection('users')
    query = users_ref.where('email', '==', email).limit(1)
    docs = query.stream()
    
    for doc in docs:
        user_data = doc.to_dict()
        user_data['id'] = doc.id
        return user_data
    
    return None

def create_user(user_data):
    """Create a new user"""
    # Add created timestamp
    user_data['createdAt'] = firestore.SERVER_TIMESTAMP
    
    # Add to Firestore
    user_ref = db.collection('users').add(user_data)
    return user_ref.id

def update_user(user_id, data):
    """Update user"""
    # Add updated timestamp
    data['updatedAt'] = firestore.SERVER_TIMESTAMP
    
    user_ref = db.collection('users').document(user_id)
    user_ref.update(data)
    
    # Get updated user
    updated_user = user_ref.get()
    if not updated_user.exists:
        return None
    
    user_data = updated_user.to_dict()
    # Don't return password
    if 'password' in user_data:
        del user_data['password']
    user_data['id'] = updated_user.id
    
    return user_data

def delete_user(user_id):
    """Delete user"""
    db.collection('users').document(user_id).delete()
    return True

# Attendance operations
def add_attendance_record(data):
    """Add a new attendance record"""
    # Add created timestamp
    data['createdAt'] = firestore.SERVER_TIMESTAMP
    
    # Add to Firestore
    attendance_ref = db.collection('attendance').add(data)
    return attendance_ref.id

def get_attendance_by_date(date):
    """Get attendance records for a specific date"""
    attendance_ref = db.collection('attendance')
    query = attendance_ref.where('date', '==', date)
    docs = query.stream()
    
    records = []
    for doc in docs:
        record_data = doc.to_dict()
        record_data['id'] = doc.id
        records.append(record_data)
    
    return records

def get_attendance_by_student(student_id):
    """Get attendance records for a specific student"""
    attendance_ref = db.collection('attendance')
    query = attendance_ref.where('studentId', '==', student_id)
    docs = query.stream()
    
    records = []
    for doc in docs:
        record_data = doc.to_dict()
        record_data['id'] = doc.id
        records.append(record_data)
    
    return records

def update_attendance_status(record_id, status, time_in=None):
    """Update attendance status"""
    data = {
        'status': status,
        'updatedAt': firestore.SERVER_TIMESTAMP
    }
    
    if time_in:
        data['timeIn'] = time_in
    
    attendance_ref = db.collection('attendance').document(record_id)
    attendance_ref.update(data)
    
    # Get updated record
    updated_record = attendance_ref.get()
    if not updated_record.exists:
        return None
    
    record_data = updated_record.to_dict()
    record_data['id'] = updated_record.id
    
    return record_data
