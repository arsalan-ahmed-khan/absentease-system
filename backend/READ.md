# AbsentEase System - Flask Backend

This is the Flask backend for the AbsentEase System, a student attendance tracking application.

## Features

- Authentication and authorization using JWT
- Firebase integration for data storage
- REST API endpoints for user management and attendance tracking
- Middleware for request validation and access control

## Getting Started

### Prerequisites

- Python 3.8+
- Firebase account with a project set up

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/absentease-system.git
cd absentease-system/backend-flask
```

2. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Set up Firebase credentials
   - Create a service account in your Firebase project
   - Download the service account key JSON file
   - Rename it to `firebase-credentials.json` and place it in the root directory

5. Create a `.env` file based on `.env.example` and set your environment variables

### Running the Application

```bash
python run.py
```

The application will be available at http://localhost:5000

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Attendance

- `POST /api/attendance` - Create attendance record
- `GET /api/attendance/date/:date` - Get attendance by date
- `GET /api/attendance/student/:id` - Get student attendance
- `PUT /api/attendance/:id` - Update attendance status
- `POST /api/attendance/scan` - Mark attendance by QR code scan

## Testing

```bash
pytest
```

## License

MIT
