from flask import Blueprint, request, jsonify
from app.middleware.auth_middleware import token_required
from app.services.firebase_service import add_attendance_record, get_attendance_by_date, get_attendance_by_student, update_attendance_status
from app.utils.helpers import validate_date_format

attendance_bp = Blueprint('attendance', __name__)

@attendance_bp.route('/', methods=['POST'])
@token_required
def create_attendance(current_user):
    data = request.get_json()
    
    if not data or not all(k in data for k in ('studentId', 'subject', 'status', 'date')):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Only teachers can create attendance records
    if current_user['userType'] != 'teacher' and current_user['userType'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    
    # Validate date format
    if not validate_date_format(data['date']):
        return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    # Add time if not provided
    if 'timeIn' not in data:
        from datetime import datetime
        data['timeIn'] = datetime.now().strftime("%H:%M")
    
    try:
        record_id = add_attendance_record(data)
        return jsonify({
            'message': 'Attendance record created successfully',
            'recordId': record_id
        }), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@attendance_bp.route('/date/<date>', methods=['GET'])
@token_required
def get_attendance_for_date(current_user, date):
    # Validate date format
    if not validate_date_format(date):
        return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    try:
        records = get_attendance_by_date(date)
        return jsonify(records), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@attendance_bp.route('/student/<student_id>', methods=['GET'])
@token_required
def get_student_attendance(current_user, student_id):
    # Parents can only view their children's attendance
    if current_user['userType'] == 'parent':
        # Check if student belongs to parent
        # This would require a relation check in your database
        pass
    
    try:
        records = get_attendance_by_student(student_id)
        return jsonify(records), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@attendance_bp.route('/<record_id>', methods=['PUT'])
@token_required
def update_attendance(current_user, record_id):
    # Only teachers can update attendance
    if current_user['userType'] != 'teacher' and current_user['userType'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    if not data or not data.get('status'):
        return jsonify({'message': 'Missing status field'}), 400
    
    try:
        updated_record = update_attendance_status(record_id, data['status'], data.get('timeIn'))
        return jsonify(updated_record), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@attendance_bp.route('/scan', methods=['POST'])
def scan_qr_code():
    data = request.get_json()
    
    if not data or not all(k in data for k in ('studentId', 'qrCode')):
        return jsonify({'message': 'Missing required fields'}), 400
    
    try:
        # Parse QR code data
        import json
        qr_data = json.loads(data['qrCode'])
        
        if not qr_data.get('subjectId') or not qr_data.get('subjectName'):
            return jsonify({'message': 'Invalid QR code data'}), 400
        
        # Create attendance record
        from datetime import datetime
        record = {
            'studentId': data['studentId'],
            'subject': qr_data['subjectName'],
            'status': 'present',
            'timeIn': datetime.now().strftime("%H:%M"),
            'date': datetime.now().strftime("%Y-%m-%d")
        }
        
        record_id = add_attendance_record(record)
        
        return jsonify({
            'message': 'Attendance marked successfully',
            'recordId': record_id
        }), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500
