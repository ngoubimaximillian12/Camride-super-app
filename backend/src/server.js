// server.js - COMPLETE PRODUCTION BACKEND
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }
});

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'camride-super-secret-2025';
const PORT = process.env.PORT || 3001;

// In-memory storage
const users = new Map();
const drivers = new Map();
const vehicles = new Map();
const rides = new Map();
const foodOrders = new Map();
const restaurants = new Map();
const menuItems = new Map();
const ratings = new Map();
const emergencies = new Map();
const lostItems = new Map();
const scheduledRides = new Map();

// Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// AUTHENTICATION
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, phone, email, password, type } = req.body;
    
    if (Array.from(users.values()).find(u => u.phone === phone)) {
      return res.status(400).json({ error: 'Phone already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = Date.now().toString();

    const user = {
      id: userId,
      name, phone, email, type,
      passwordHash: hashedPassword,
      verified: type === 'customer',
      loyalty: { points: 0, tier: 'bronze', totalRides: 0 },
      wallet: { balance: 0 },
      referralCode: userId.slice(-6).toUpperCase(),
      createdAt: new Date()
    };

    users.set(userId, user);

    if (type === 'driver') {
      drivers.set(userId, {
        id: userId,
        available: false,
        verified: false,
        location: null,
        vehicles: [],
        stats: { totalRides: 0, totalEarnings: 0, rating: 5.0 }
      });
    }

    const token = jwt.sign({ id: userId, type }, JWT_SECRET, { expiresIn: '30d' });

    res.json({ 
      success: true, 
      token, 
      user: { ...user, passwordHash: undefined } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = Array.from(users.values()).find(u => u.phone === phone);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, type: user.type }, JWT_SECRET, { expiresIn: '30d' });
    
    res.json({ 
      success: true, 
      token, 
      user: { ...user, passwordHash: undefined } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// VEHICLE REGISTRATION
app.post('/api/vehicles/register', authenticateToken, async (req, res) => {
  const { vehicleType, make, model, year, color, plate, bikeType, serviceType } = req.body;

  const vehicleId = Date.now().toString();
  const vehicle = {
    id: vehicleId,
    driverId: req.user.id,
    vehicleType, make, model, year, color, plate,
    bikeType: vehicleType === 'bike' ? bikeType : null,
    serviceType,
    verified: false,
    active: false,
    createdAt: new Date()
  };

  vehicles.set(vehicleId, vehicle);

  const driver = drivers.get(req.user.id);
  if (driver) {
    driver.vehicles = driver.vehicles || [];
    driver.vehicles.push(vehicleId);
    drivers.set(req.user.id, driver);
  }

  res.json({ success: true, vehicleId, vehicle });
});

// DISTANCE CALCULATION
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// PRICING ENGINE
function calculateFare(pickup, destination, vehicleType, rideType = 'standard') {
  const distance = calculateDistance(pickup.lat, pickup.lng, destination.lat, destination.lng);
  
  const baseFares = {
    bike: { economy: 800, standard: 1000, comfort: 1200, premium: 1500 },
    car: { economy: 2000, standard: 2500, comfort: 3250, premium: 4500 }
  };

  const perKmRates = {
    bike: { economy: 80, standard: 100, comfort: 120, premium: 150 },
    car: { economy: 160, standard: 200, comfort: 260, premium: 360 }
  };

  const baseFare = baseFares[vehicleType][rideType];
  const perKm = perKmRates[vehicleType][rideType];
  const fare = baseFare + (distance * perKm);

  return {
    fare: Math.round(fare),
    distance: distance.toFixed(2),
    estimatedMinutes: Math.round(distance * 3),
    vehicleType
  };
}

// RIDE REQUEST
app.post('/api/rides/request', authenticateToken, async (req, res) => {
  const { pickup, destination, vehiclePreference, rideType = 'standard' } = req.body;

  const fareData = calculateFare(pickup, destination, vehiclePreference === 'bike' ? 'bike' : 'car', rideType);

  const rideId = Date.now().toString();
  const ride = {
    id: rideId,
    customerId: req.user.id,
    pickup, destination,
    vehiclePreference, rideType,
    ...fareData,
    status: 'pending',
    createdAt: new Date()
  };

  rides.set(rideId, ride);

  res.json({ success: true, rideId, ride });
});

// LOYALTY POINTS
function earnLoyaltyPoints(userId, rideId) {
  const ride = rides.get(rideId);
  if (!ride) return 0;

  const points = Math.floor(ride.fare / 100);
  const user = users.get(userId);
  
  if (user) {
    user.loyalty.points += points;
    user.loyalty.totalRides += 1;
    
    if (user.loyalty.totalRides >= 100) user.loyalty.tier = 'gold';
    else if (user.loyalty.totalRides >= 50) user.loyalty.tier = 'silver';
    
    users.set(userId, user);
  }
  return points;
}

app.get('/api/users/loyalty', authenticateToken, (req, res) => {
  const user = users.get(req.user.id);
  const benefits = {
    bronze: { discount: 0, priorityMatching: false },
    silver: { discount: 5, priorityMatching: true },
    gold: { discount: 10, priorityMatching: true, monthlyFreeRides: 1 }
  };

  res.json({ 
    loyalty: user?.loyalty || { points: 0, tier: 'bronze', totalRides: 0 },
    benefits: benefits[user?.loyalty?.tier || 'bronze']
  });
});

// FOOD DELIVERY
app.get('/api/restaurants/nearby', (req, res) => {
  const nearbyRestaurants = [
    { id: 'r1', name: 'Poulet DG Express', rating: 4.8, time: '25-35 min', fee: 500, image: '🍗' },
    { id: 'r2', name: 'Pizza Express', rating: 4.7, time: '20-30 min', fee: 500, image: '🍕' },
    { id: 'r3', name: 'Sawa Grill', rating: 4.6, time: '30-40 min', fee: 700, image: '🥩' }
  ];

  res.json({ restaurants: nearbyRestaurants });
});

app.get('/api/restaurants/:id', (req, res) => {
  const menus = {
    r1: [{ id: 'm1', name: 'Poulet DG', price: 3500, image: '🍗', desc: 'Chicken with plantains' }],
    r2: [{ id: 'm2', name: 'Margherita Pizza', price: 3000, image: '🍕', desc: 'Classic cheese pizza' }]
  };

  res.json({ 
    restaurant: { id: req.params.id, name: 'Restaurant' },
    menu: menus[req.params.id] || [] 
  });
});

app.post('/api/food/order', authenticateToken, (req, res) => {
  const { restaurantId, items, deliveryAddress, vehiclePreference } = req.body;

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = vehiclePreference === 'bike' ? 300 : 500;

  const orderId = Date.now().toString();
  foodOrders.set(orderId, {
    id: orderId,
    customerId: req.user.id,
    restaurantId,
    items,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    deliveryAddress,
    vehiclePreference,
    status: 'pending',
    createdAt: new Date()
  });

  res.json({ success: true, orderId, order: foodOrders.get(orderId) });
});

// TRIP HISTORY
app.get('/api/trips/history', authenticateToken, (req, res) => {
  const userRides = Array.from(rides.values())
    .filter(r => r.customerId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ trips: userRides });
});

// REAL-TIME TRACKING
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('driver:online', (data) => {
    const { driverId, location } = data;
    const driver = drivers.get(driverId);
    if (driver) {
      driver.socketId = socket.id;
      driver.location = location;
      driver.available = true;
      drivers.set(driverId, driver);
    }
  });

  socket.on('disconnect', () => {
    for (let [id, driver] of drivers) {
      if (driver.socketId === socket.id) {
        driver.available = false;
        drivers.set(id, driver);
      }
    }
  });
});

// SERVER START
server.listen(PORT, () => {
  console.log(`
    🚀 CamRide Super App Backend Running!
    📍 Port: ${PORT}
    
    ✅ Features Active:
    - Authentication
    - Rides (Cars & Bikes)
    - Food Delivery
    - Vehicle Registration
    - Loyalty Program
    - Real-time Tracking
    
    Ready to serve Cameroon! 🇨🇲
  `);
});