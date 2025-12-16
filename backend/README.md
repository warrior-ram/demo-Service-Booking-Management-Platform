# Service Booking Platform - Backend API

## 🚀 Setup Instructions

### Prerequisites
- Python 3.10+
- pip

### Installation

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the development server:**
   ```bash
   uvicorn app.main:app --reload
   ```

3. **Access the API:**
   - API Root: http://localhost:8000
   - Interactive Docs (Swagger): http://localhost:8000/docs
   - Alternative Docs (ReDoc): http://localhost:8000/redoc
   - Health Check: http://localhost:8000/health

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py        # Environment & settings
│   │   └── database.py      # Database connection & session
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py          # User model
│   │   ├── service.py       # Service model
│   │   ├── booking.py       # Booking model
│   │   └── availability.py  # Availability model
│   └── api/
│       ├── __init__.py
│       └── routes/          # API route handlers (future)
├── requirements.txt
└── README.md
```

## 🗄️ Database Schema

### User
- id (Primary Key)
- email (Unique)
- hashed_password
- full_name
- role ("customer" / "admin")
- is_active
- created_at

### Service
- id (Primary Key)
- name
- description (Optional)
- duration_minutes
- price
- is_active
- created_at

### Booking
- id (Primary Key)
- user_id (Foreign Key → User)
- service_id (Foreign Key → Service)
- booking_date
- start_time
- end_time
- status ("pending" / "confirmed" / "cancelled")
- created_at

### Availability
- id (Primary Key)
- day_of_week (0=Monday, 6=Sunday)
- start_time
- end_time
- is_blocked (For blocking specific times)

## 🔧 Configuration

Create a `.env` file in the backend directory to override default settings:

```env
DATABASE_URL=sqlite:///./app.db
DEBUG=True
ALLOWED_ORIGINS=["http://localhost:3000"]
```

## ✅ Verification

After starting the server, verify:
1. ✅ Health endpoint returns `{"status": "ok"}` at http://localhost:8000/health
2. ✅ Swagger UI is accessible at http://localhost:8000/docs
3. ✅ `app.db` file is created in the backend directory
4. ✅ All tables (user, service, booking, availability) exist in the database

## 📝 Next Steps

- Implement authentication & JWT handling
- Create CRUD API endpoints
- Add booking availability algorithm
- Implement email notification system
