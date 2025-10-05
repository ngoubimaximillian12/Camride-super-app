# CamRide Super App

Full-stack mobility and logistics platform for Cameroon with ride-hailing, food delivery, and Mobile Money integration.

## Features

### Ride-Hailing
- Multi-vehicle support (bikes and cars)
- Real-time driver tracking with Socket.io
- Nearby drivers display with ratings and ETA
- Dynamic fare calculation
- Weather surge pricing
- Ride scheduling
- Multi-stop routes
- Vehicle tiers: Economy, Standard, Comfort, Premium

### Food Delivery
- Restaurant marketplace with ratings
- Real-time menu browsing
- Cart management
- Order tracking
- Delivery time estimates

### Payment System
- MTN Mobile Money integration
- Orange Money integration
- In-app wallet
- Cash payment option
- Multi-payment method support

### Safety Features
- SOS Emergency button
- Live trip sharing
- Driver verification
- Safety ratings
- Emergency contact management

### User Features
- Bilingual support (French/English)
- Loyalty rewards program (Bronze/Silver/Gold tiers)
- User authentication with JWT
- Profile management
- Trip history

## Tech Stack

### Frontend
- React 19.1.1 with TypeScript
- Vite 7.1.9
- Tailwind CSS 3.4.0
- Lucide React icons
- Socket.io Client

### Backend
- Node.js with Express 4.21.1
- Socket.io 4.8.0
- JWT authentication
- Bcrypt password hashing
- CORS enabled
- In-memory data storage (Maps)

## Project Structure

## Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
## Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm start
Backend runs on: http://localhost:3001

Frontend Setup
bash
cd camride-super-app/frontend
npm install
npm run dev
Frontend runs on: http://localhost:5176

API Endpoints
Authentication
POST /api/auth/signup - User registration
POST /api/auth/login - User login
Rides
POST /api/rides/request - Request a ride
GET /api/trips/history - Get trip history
Vehicles
POST /api/vehicles/register - Register driver vehicle
Food
GET /api/restaurants/nearby - Get nearby restaurants
GET /api/restaurants/:id - Get restaurant details
POST /api/food/order - Place food order
Loyalty
GET /api/users/loyalty - Get loyalty points and tier
Environment Variables
Backend (.env)
JWT_SECRET=camride-super-secret-2025
PORT=3001
Key Dependencies
Backend
express: ^4.21.1
socket.io: ^4.8.0
bcrypt: ^5.1.1
jsonwebtoken: ^9.0.2
cors: ^2.8.5
axios: ^1.7.7
Frontend
react: ^19.1.1
react-dom: ^19.1.1
vite: ^7.1.7
tailwindcss: ^3.4.0
lucide-react: (icons)
typescript: ~5.9.3
Features Roadmap
Phase 1 (Current)
 User authentication
 Ride booking
 Food ordering
 Basic payment UI
 Bilingual support
Phase 2 (Planned)
 Real-time driver matching
 Live GPS tracking
 Persistent database (MongoDB/PostgreSQL)
 Actual Mobile Money API integration
 Push notifications
Phase 3 (Future)
 Driver mobile app
 Package delivery
 Intercity rides
 Corporate accounts
 Advanced analytics dashboard
Usage
For Customers
Sign up as a customer
Choose ride or food delivery
Select vehicle/restaurant
Enter destination/order
Choose payment method
Confirm booking
For Drivers
Sign up as a driver
Register vehicle details
Go online to receive requests
Accept ride requests
Complete trips
Track earnings
Security Features
JWT token authentication
Bcrypt password hashing
CORS protection
Input validation
Secure API endpoints
Payment Methods
Wallet (in-app balance)
MTN Mobile Money
Orange Money
Cash on delivery/arrival
Local Development
Start both servers:

Terminal 1 - Backend:

bash
cd backend
npm start
Terminal 2 - Frontend:

bash
cd camride-super-app/frontend
npm run dev
Deployment
Backend
Deploy to Heroku, Railway, or Render
Set environment variables
Configure production database
Frontend
Build: npm run build
Deploy to Vercel, Netlify, or Cloudflare Pages
Update API_URL to production backend
Contributing
Fork the repository
Create feature branch (git checkout -b feature/AmazingFeature)
Commit changes (git commit -m 'Add some AmazingFeature')
Push to branch (git push origin feature/AmazingFeature)
Open Pull Request
License
This project is proprietary and confidential.

Contact
Developer: Ngoubi Maximillian GitHub: @ngoubimaximillian12

Acknowledgments
Built for the Cameroon market
Inspired by Uber, Bolt, and Jumia
Tailored for African Mobile Money ecosystem
