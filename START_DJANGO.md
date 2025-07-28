# Django Backend Setup Instructions

## Starting Django Development Server

To run the Django backend alongside the existing Node.js application:

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Run Django Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Create Django Superuser (Optional)
```bash
python manage.py createsuperuser
```

### 4. Start Django Server
```bash
python manage.py runserver 8000
```

### 5. Access Django Services
- **API Endpoints**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/
- **User Endpoint**: http://localhost:8000/api/user/

## React Native Mobile App

### 1. Navigate to Mobile Directory
```bash
cd mobile
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Expo Development Server
```bash
npm start
```

### 4. Run on Platforms
- **iOS**: `npm run ios` (requires Xcode)
- **Android**: `npm run android` (requires Android Studio)
- **Web**: `npm run web`

## API Migration Status

The Django backend provides identical API endpoints to the original Node.js version:
- `/api/user/` - Current player data
- `/api/tea-cards/` - Tea card collection
- `/api/quests/` - Quest system with completion
- `/api/achievements/` - Achievement tracking
- `/api/weekly-events/` - Weekly event schedule

Both backends can run simultaneously for transition testing.