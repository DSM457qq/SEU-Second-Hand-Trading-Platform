# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **SEU Second-Hand Trading Platform** (东南大学校园二手交易平台) - a campus-focused e-commerce platform built for Southeast University. It enables students and faculty to buy/sell second-hand goods with campus email verification.

**Tech Stack:**
- **Backend:** Python Flask 2.3.3, Flask-SQLAlchemy, Flask-Login, MySQL 8.0+
- **Frontend:** HTML5, CSS3, JavaScript (ES6+), component-based architecture
- **Database:** MySQL with utf8mb4_unicode_ci charset (supports Chinese and emoji)

## Development Commands

### Starting the Application
```bash
# Windows (Quick start)
start-dev.bat
# or PowerShell
./start-dev.ps1

# Mac/Linux
python run.py
```

The app runs on `http://localhost:5000` with debug mode enabled.

### Database Setup
```bash
# Create database schema
mysql -u root -p < database/schema.sql

# Load test data (optional)
mysql -u root -p < database/seed_data.sql
```

### Environment Setup
```bash
# Create and activate virtual environment (Windows)
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Using Mock API for Frontend Development

The project includes a **complete Mock API system** for frontend testing without backend:

1. Start the application: `python run.py`
2. Open http://localhost:5000
3. Press **F12** to open DevTools Console
4. Run: `window.USE_MOCK_API = true; location.reload();`
5. Now all API calls return simulated data

Mock API file: `app/static/js/mock-api.js` (alternates with `app/static/js/api.js`)

## Architecture

### Backend Structure

```
app/
├── __init__.py           # Flask app factory (create_app)
├── routes.py             # Main route registration
├── models.py             # Database models (minimal - needs expansion)
├── templates/            # Jinja2 templates (see below)
├── static/
│   ├── css/style.css    # Modern CSS with variables, responsive design
│   ├── js/
│   │   ├── api.js       # Real API client (enterprise-grade)
│   │   ├── mock-api.js  # Mock API for testing
│   │   └── main.js      # Utility modules (NotificationManager, CartManager, etc.)
│   └── images/
└── api/                 # API blueprints (RESTful endpoints)
    ├── auth.py          # Authentication endpoints
    ├── cart.py          # Shopping cart endpoints
    ├── items.py         # Item CRUD
    ├── orders.py        # Order management
    ├── users.py         # User profiles
    └── reviews.py       # Reviews and ratings
```

### Frontend Structure

**Templates** (Jinja2 with base template inheritance):
- `base.html` - Base template with navigation, footer, common scripts
- `index.html` - Homepage with featured items and categories
- `items.html` - Search/browse with filters (category, price, sort)
- `item_detail.html` - Individual item details
- `login.html` / `register.html` - Authentication with @seu.edu.cn validation
- `cart.html` - Session-based shopping cart
- `checkout.html` - Order placement with address selection
- `profile.html` - User profile and order history

**Frontend Modules** (in `app/static/js/main.js`):
- `NotificationManager` - Toast notifications
- `FormValidator` - Form validation (SEU email, password strength)
- `CartManager` - Shopping cart (sessionStorage-based)
- `AuthManager` - User authentication state
- `DOMUtils` - DOM manipulation helpers
- `LoadingManager` - Loading state management

### Database Schema

**Core Tables:**
- `users` - User accounts with bcrypt password hashing
- `items` - Product listings with full-text search on title/description
- `orders` - Order management with status tracking
- `order_items` - Order-item relationships (many-to-many)
- `addresses` - User delivery addresses
- `reviews` - Buyer/seller ratings (1-5 stars)

**Key Features:**
- Charset: `utf8mb4_unicode_ci` for Chinese/emoji support
- InnoDB engine with ACID transactions
- Foreign key cascading deletes
- Optimized indexes for search (category, price, created_at, full-text)

### API Design

**All endpoints follow this pattern:**
- Base URL: `/api`
- Request format: JSON
- Response format: `{ code: 0, message: "成功", data: {}, timestamp: 1234567890 }`
- Error handling with automatic retry (max 3 times for network/timeout)

**API Modules:**
- `API.user` - Registration, login, profile management
- `API.item` - Search, CRUD, stock checking
- `API.cart` - Add/remove/update cart items
- `API.order` - Create, list, cancel, confirm delivery
- `API.category` - Get item categories
- `API.recommend` - Popular, latest, personalized recommendations
- `API.address` - Campus delivery addresses

Full API documentation: `FRONTEND_API_DOCS.md`

## Key Implementation Details

### Authentication System
- **Email Validation:** Must be `@seu.edu.cn` domain (campus restriction)
- **Password Hashing:** Uses bcrypt for secure storage
- **Session Management:** Flask-Login with session-based auth
- **Token-based:** JWT tokens returned in login response (future implementation)

### Shopping Cart
- **Storage:** `sessionStorage` (persists across page reloads, cleared on browser close)
- **Reasoning:** Temporary cart as per project requirements (no user cart persistence)
- **Management:** `CartManager` module in `main.js` handles all cart operations

### Search Functionality
- **Full-text search:** MySQL FULLTEXT index on `items.title` and `items.description`
- **Filters:** Category, price range, sorting (latest, popular, price asc/desc)
- **Search types:** By title, seller name, or category

### Security Considerations
- **SQL Injection:** All queries use parameterized statements or SQLAlchemy ORM
- **CSRF Protection:** Flask-WTF CSRF tokens enabled
- **Input Validation:** Frontend validation + backend sanitization
- **Password Requirements:** 8+ characters, must include uppercase, lowercase, and numbers

### Campus-Specific Features
- **Email verification:** SEU email domain restriction (@seu.edu.cn)
- **Delivery addresses:** Campus building/dormitory-based addresses
- **User trust:** Campus identity provides inherent trust system

## Development Workflow

### Frontend Development
1. Enable Mock API: `window.USE_MOCK_API = true; location.reload();`
2. Modify HTML templates and JavaScript
3. Test in browser (no backend needed)
4. See `QUICK_START.md` for testing guide

### Backend Development
1. Implement API endpoints in `app/api/` modules following `FRONTEND_API_DOCS.md` spec
2. Update `app/models.py` with database models if needed
3. Register blueprints in `app/routes.py`
4. Test with real database or Mock API disabled

### Database Migrations
- Schema files in `database/` folder
- `schema.sql` - Complete database structure
- `seed_data.sql` - Test data for development
- migrations folder for version control

## Important Files

| File | Purpose |
|------|---------|
| `run.py` | Application entry point |
| `config.py` | Flask configuration (currently minimal - needs DB config) |
| `app/__init__.py` | Flask app factory |
| `app/routes.py` | Route registration |
| `app/static/js/api.js` | Real API client (enterprise-grade with interceptors) |
| `app/static/js/mock-api.js` | Complete mock implementation for testing |
| `FRONTEND_API_DOCS.md` | Comprehensive API interface documentation |
| `QUICK_START.md` | 30-second startup guide |
| `database/schema.sql` | Complete database structure with comments |

## Configuration Notes

**Current State:**
- Debug mode enabled (`app.run(debug=True)`)
- JSON responses support Chinese (`JSON_AS_ASCII = False`)
- Database configuration needs to be added to `config.py`
- No external services connected (email, payments are mock)

**To Add:**
- MySQL connection credentials in `config.py`
- SECRET_KEY for session encryption
- Email server config for verification emails
- Payment gateway integration (currently mock)

## Common Tasks

### Adding a New API Endpoint
1. Create function in appropriate `app/api/` module
2. Follow response format: `{ code, message, data, timestamp }`
3. Register blueprint in `app/routes.py`
4. Update `FRONTEND_API_DOCS.md` if user-facing

### Adding a New Page
1. Create HTML template in `app/templates/`
2. Extend `base.html` for consistent layout
3. Add route in `app/routes.py`
4. Update navigation in `base.html` if needed

### Database Query Examples
```python
# Using SQLAlchemy ORM (when models are implemented)
from app.models import User, Item

# Get user by email
user = User.query.filter_by(email='user@seu.edu.cn').first()

# Search items with filters
items = Item.query.filter(
    Item.category == 'books',
    Item.price.between(0, 100),
    Item.is_active == True
).order_by(Item.created_at.desc()).all()
```

## Testing

The project includes comprehensive frontend testing capabilities:
- Mock API enables full frontend testing without backend
- Browser console commands for debugging (see `QUICK_START.md`)
- Responsive design testing (mobile, tablet, desktop)
- Form validation testing

See `QUICK_START.md` for detailed testing procedures and console commands.
