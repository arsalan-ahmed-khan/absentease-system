import re
from datetime import datetime

def validate_date_format(date_str):
    """Validate that a string is in YYYY-MM-DD format"""
    try:
        # Check format with regex
        if not re.match(r'^\d{4}-\d{2}-\d{2}$', date_str):
            return False
        
        # Check valid date
        datetime.strptime(date_str, '%Y-%m-%d')
        return True
    except ValueError:
        return False

def format_date(date_str):
    """Format date string for display"""
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d')
        return date.strftime('%b %d, %Y')
    except ValueError:
        return date_str

def generate_attendance_message(student_name, status, subject, date):
    """Generate attendance notification message"""
    date_formatted = format_date(date)
    
    if status == 'absent':
        return f"Attendance Alert: {student_name} was marked absent for {subject} on {date_formatted}."
    elif status == 'late':
        return f"Attendance Alert: {student_name} arrived late for {subject} on {date_formatted}."
    elif status == 'present':
        return f"Attendance Update: {student_name} was present for {subject} on {date_formatted}."
    else:
        return f"Attendance Update: {student_name}'s attendance status for {subject} on {date_formatted} has been updated."
