import { useState, useEffect } from 'react';
import { MapPin, Navigation, Car, Bike, UtensilsCrossed, ShoppingBag, Plus, Minus, Search, Star, ChevronRight, X, Menu, Check, FileText, Sparkles, Award, Cloud, Calendar, MapPinned, Package, Users, Gift, Zap, Shield, User, Lock, Mail, Phone, CreditCard, Wallet, AlertTriangle, MessageCircle, Clock, DollarSign, Globe } from 'lucide-react';

const API_URL = 'http://localhost:3001';

export default function CamRidePremium() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('welcome');
  const [appMode, setAppMode] = useState('rides');
  const [view, setView] = useState('home');
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [language, setLanguage] = useState('fr'); // fr or en
  
  const [rideVehicleType, setRideVehicleType] = useState('any');
  const [destination, setDestination] = useState('');
  const [fareEstimate, setFareEstimate] = useState<any>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [weatherSurge] = useState({ surge: 1.3, condition: 'Rain' });
  const [loyalty] = useState({ points: 450, tier: 'silver', totalRides: 67 });

  // New feature states
  const [walletBalance, setWalletBalance] = useState(25000); // XAF
  const [paymentMethod, setPaymentMethod] = useState('wallet'); // wallet, mtn, orange, cash
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);
  const [nearbyDrivers] = useState([
    { id: 1, name: 'Jean K.', rating: 4.9, distance: '0.5 km', eta: '2 min', vehicle: 'bike' },
    { id: 2, name: 'Marie T.', rating: 4.8, distance: '1.2 km', eta: '5 min', vehicle: 'car' },
    { id: 3, name: 'Paul N.', rating: 4.7, distance: '0.8 km', eta: '3 min', vehicle: 'bike' }
  ]);
  const [scheduledRides, setScheduledRides] = useState<any[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Login form states
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form states
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupUserType, setSignupUserType] = useState('customer');

  const texts = {
    fr: {
      welcome: 'Votre Super App pour le Cameroun',
      login: 'Se Connecter',
      signup: "S'inscrire",
      rides: 'Courses',
      food: 'Nourriture',
      schedule: 'Planifier',
      multiStop: 'Multi-Arrêts',
      more: 'Plus',
      chooseRide: 'Choisissez votre course',
      whereTo: 'Où allez-vous?',
      requestRide: 'Demander une course',
      getEstimate: 'Obtenir estimation',
      wallet: 'Portefeuille',
      safety: 'Sécurité',
      emergency: 'Urgence SOS',
      payment: 'Paiement',
      mtnMoney: 'MTN Mobile Money',
      orangeMoney: 'Orange Money',
      cash: 'Espèces'
    },
    en: {
      welcome: 'Your Super App for Cameroon',
      login: 'Login',
      signup: 'Sign Up',
      rides: 'Rides',
      food: 'Food',
      schedule: 'Schedule',
      multiStop: 'Multi-Stop',
      more: 'More',
      chooseRide: 'Choose Your Ride',
      whereTo: 'Where to?',
      requestRide: 'Request Ride',
      getEstimate: 'Get Estimate',
      wallet: 'Wallet',
      safety: 'Safety',
      emergency: 'SOS Emergency',
      payment: 'Payment',
      mtnMoney: 'MTN Mobile Money',
      orangeMoney: 'Orange Money',
      cash: 'Cash'
    }
  };

  const t = texts[language];

  const vehicleOptions = [
    { id: 'bike', name: 'Bike', icon: '🏍️', desc: 'Fastest & Cheapest', color: 'from-green-500 to-emerald-600' },
    { id: 'car', name: 'Car', icon: '🚗', desc: 'More Comfort', color: 'from-blue-500 to-blue-600' },
    { id: 'any', name: 'Any', icon: '⚡', desc: 'First Available', color: 'from-purple-500 to-pink-600' }
  ];

  const restaurants = [
    { id: 'r1', name: 'Poulet DG Express', rating: 4.8, time: '25-35 min', fee: 500, image: '🍗', popular: true },
    { id: 'r2', name: 'Pizza Express', rating: 4.7, time: '20-30 min', fee: 500, image: '🍕', popular: true },
    { id: 'r3', name: 'Sawa Grill', rating: 4.6, time: '30-40 min', fee: 700, image: '🥩', popular: false }
  ];

  const menuItems: any = {
    r1: [{ id: 'm1', name: 'Poulet DG', price: 3500, image: '🍗', desc: 'Chicken with plantains' }],
    r2: [{ id: 'm2', name: 'Margherita Pizza', price: 3000, image: '🍕', desc: 'Classic cheese pizza' }]
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginPhone, password: loginPassword })
      });
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Cannot connect to server. Make sure backend is running on port 3001');
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: signupName, 
          phone: signupPhone, 
          email: signupEmail, 
          password: signupPassword, 
          type: signupUserType 
        })
      });
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        alert(data.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Cannot connect to server. Make sure backend is running on port 3001');
    }
  };

  const estimateFare = () => {
    if (!destination) return alert('Enter destination');
    const baseFare = rideVehicleType === 'bike' ? 1000 : 2500;
    const fare = baseFare + Math.random() * 2000;
    setFareEstimate({ fare: Math.round(fare), distance: '8.5', duration: 25 });
  };

  const addToCart = (item: any) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleEmergencySOS = () => {
    alert('🚨 SOS Alert Sent! Emergency contacts and local authorities have been notified. Your location is being shared.');
    // In production: send location to emergency contacts + police
  };

  const scheduleRide = (date: string, time: string) => {
    const newRide = {
      id: Date.now(),
      destination,
      date,
      time,
      vehicleType: rideVehicleType,
      estimatedFare: fareEstimate?.fare
    };
    setScheduledRides([...scheduledRides, newRide]);
    setShowScheduleModal(false);
    alert(`Ride scheduled for ${date} at ${time}`);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Payment Modal
  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">{t.payment}</h3>
          <button onClick={() => setShowPaymentModal(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => setPaymentMethod('wallet')}
            className={`w-full p-4 rounded-2xl border-2 flex items-center gap-3 ${paymentMethod === 'wallet' ? 'border-purple-600 bg-purple-50' : 'border-gray-200'}`}
          >
            <Wallet className="w-6 h-6 text-purple-600" />
            <div className="text-left flex-1">
              <p className="font-bold">{t.wallet}</p>
              <p className="text-sm text-gray-600">{walletBalance.toLocaleString()} XAF</p>
            </div>
          </button>

          <button 
            onClick={() => setPaymentMethod('mtn')}
            className={`w-full p-4 rounded-2xl border-2 flex items-center gap-3 ${paymentMethod === 'mtn' ? 'border-yellow-600 bg-yellow-50' : 'border-gray-200'}`}
          >
            <Phone className="w-6 h-6 text-yellow-600" />
            <div className="text-left">
              <p className="font-bold">{t.mtnMoney}</p>
              <p className="text-sm text-gray-600">+237 6XX XXX XXX</p>
            </div>
          </button>

          <button 
            onClick={() => setPaymentMethod('orange')}
            className={`w-full p-4 rounded-2xl border-2 flex items-center gap-3 ${paymentMethod === 'orange' ? 'border-orange-600 bg-orange-50' : 'border-gray-200'}`}
          >
            <Phone className="w-6 h-6 text-orange-600" />
            <div className="text-left">
              <p className="font-bold">{t.orangeMoney}</p>
              <p className="text-sm text-gray-600">+237 6XX XXX XXX</p>
            </div>
          </button>

          <button 
            onClick={() => setPaymentMethod('cash')}
            className={`w-full p-4 rounded-2xl border-2 flex items-center gap-3 ${paymentMethod === 'cash' ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}
          >
            <DollarSign className="w-6 h-6 text-green-600" />
            <div className="text-left">
              <p className="font-bold">{t.cash}</p>
              <p className="text-sm text-gray-600">Pay driver directly</p>
            </div>
          </button>
        </div>

        <button 
          onClick={() => setShowPaymentModal(false)}
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold"
        >
          Confirm Payment Method
        </button>
      </div>
    </div>
  );

  // Safety Modal
  const SafetyModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">{t.safety}</h3>
          <button onClick={() => setShowSafetyModal(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleEmergencySOS}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-2xl flex items-center gap-4"
          >
            <AlertTriangle className="w-8 h-8" />
            <div className="text-left">
              <p className="font-bold text-lg">{t.emergency}</p>
              <p className="text-sm opacity-90">Alert authorities & contacts</p>
            </div>
          </button>

          <div className="bg-blue-50 p-4 rounded-2xl">
            <p className="font-bold mb-2">Share Trip</p>
            <p className="text-sm text-gray-600 mb-3">Your live location will be shared</p>
            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
              Share with Family
            </button>
          </div>

          <div className="bg-purple-50 p-4 rounded-2xl">
            <p className="font-bold mb-2">Driver Info</p>
            <p className="text-sm text-gray-600">Jean K. • ⭐ 4.9 • 🏍️ Bike</p>
            <p className="text-sm text-gray-600">Plate: YDE-1234-AB</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Schedule Modal
  const ScheduleModal = () => {
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">{t.schedule} Ride</h3>
            <button onClick={() => setShowScheduleModal(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Date</label>
              <input 
                type="date" 
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full p-4 border-2 border-purple-200 rounded-2xl"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Time</label>
              <input 
                type="time" 
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full p-4 border-2 border-purple-200 rounded-2xl"
              />
            </div>

            <button 
              onClick={() => scheduleRide(scheduleDate, scheduleTime)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold"
            >
              Confirm Schedule
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    if (authView === 'welcome') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="absolute top-4 right-4 z-20">
            <button 
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full text-white font-bold border border-white/30 flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              {language === 'fr' ? 'EN' : 'FR'}
            </button>
          </div>

          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Zap className="w-16 h-16 text-yellow-400 animate-bounce" />
                <h1 className="text-6xl font-black text-white">CamRide</h1>
              </div>
              <p className="text-xl text-white/90 font-semibold">{t.welcome}</p>
              <p className="text-white/70 mt-2">Rides 🚗 · Food 🍔 · Delivery 📦</p>
            </div>

            <div className="w-full max-w-md space-y-4">
              <button
                onClick={() => setAuthView('login')}
                className="w-full bg-white text-purple-900 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-all"
              >
                {t.login}
              </button>
              
              <button
                onClick={() => setAuthView('signup')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-all border-2 border-white/20"
              >
                {t.signup}
              </button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 text-white text-center">
              <div>
                <div className="text-4xl mb-2">🏍️</div>
                <p className="text-sm font-semibold">Bikes & Cars</p>
              </div>
              <div>
                <div className="text-4xl mb-2">🍔</div>
                <p className="text-sm font-semibold">Food Delivery</p>
              </div>
              <div>
                <div className="text-4xl mb-2">⚡</div>
                <p className="text-sm font-semibold">Fast & Cheap</p>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes blob {
              0%, 100% { transform: translate(0, 0) scale(1); }
              25% { transform: translate(20px, -50px) scale(1.1); }
              50% { transform: translate(-20px, 20px) scale(0.9); }
              75% { transform: translate(20px, 50px) scale(1.05); }
            }
            .animate-blob { animation: blob 7s infinite; }
            .animation-delay-2000 { animation-delay: 2s; }
            .animation-delay-4000 { animation-delay: 4s; }
          `}</style>
        </div>
      );
    }

    if (authView === 'login') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <button onClick={() => setAuthView('welcome')} className="text-gray-600 mb-6">← Retour</button>
            
            <h2 className="text-3xl font-black text-gray-800 mb-2">Bon retour!</h2>
            <p className="text-gray-600 mb-8">Connectez-vous pour continuer</p>

            <div className="space-y-4">
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="+237 6XX XXX XXX"
                  className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-all"
              >
                Se Connecter
              </button>

              <p className="text-center text-gray-600">
                Pas de compte?{' '}
                <button onClick={() => setAuthView('signup')} className="text-purple-600 font-bold">
                  S'inscrire
                </button>
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (authView === 'signup') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <button onClick={() => setAuthView('welcome')} className="text-gray-600 mb-6">← Retour</button>
            
            <h2 className="text-3xl font-black text-gray-800 mb-2">Créer un compte</h2>
            <p className="text-gray-600 mb-8">Rejoignez CamRide aujourd'hui!</p>

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Nom complet"
                  className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-300"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  placeholder="+237 6XX XXX XXX"
                  className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-300"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="Email (optionnel)"
                  className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-300"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-300"
                />
              </div>

              <div className="bg-purple-50 p-4 rounded-2xl">
                <p className="text-sm font-semibold text-gray-700 mb-3">Je suis un:</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSignupUserType('customer')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      signupUserType === 'customer' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-gray-200'
                    }`}
                  >
                    <User className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-xs font-bold">Client</p>
                  </button>
                  <button
                    onClick={() => setSignupUserType('driver')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      signupUserType === 'driver' ? 'bg-green-600 text-white border-green-600' : 'bg-white border-gray-200'
                    }`}
                  >
                    <Car className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-xs font-bold">Chauffeur</p>
                  </button>
                </div>
              </div>

              <button
                onClick={handleSignup}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-all"
              >
                S'inscrire
              </button>

              <p className="text-center text-gray-600 text-sm">
                Déjà inscrit?{' '}
                <button onClick={() => setAuthView('login')} className="text-purple-600 font-bold">
                  Se connecter
                </button>
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  if (view === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {showPaymentModal && <PaymentModal />}
        {showSafetyModal && <SafetyModal />}
        {showScheduleModal && <ScheduleModal />}

        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-2">
                <Zap className="w-8 h-8 text-yellow-400" />
                CamRide
              </h1>
              <p className="text-purple-200 text-sm mt-1">Bonjour, {user?.name}!</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowSafetyModal(true)}
                className="p-3 bg-red-500/20 backdrop-blur-lg rounded-2xl border border-red-400/30"
              >
                <Shield className="w-6 h-6 text-red-400" />
              </button>
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="p-3 bg-green-500/20 backdrop-blur-lg rounded-2xl border border-green-400/30"
              >
                <Wallet className="w-6 h-6 text-green-400" />
              </button>
              <button onClick={() => setShowMenu(!showMenu)} className="p-3 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                <Menu className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          <div className="mx-6 mt-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-6 h-6 text-white" />
                  <span className="text-white font-bold text-lg capitalize">{loyalty.tier}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <p className="text-white text-xs font-semibold">{loyalty.points} pts</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <p className="text-white text-xs font-semibold">{loyalty.totalRides} rides</p>
                  </div>
                </div>
              </div>
              <Sparkles className="w-12 h-12 text-white opacity-80" />
            </div>
          </div>

          {weatherSurge.surge > 1 && (
            <div className="mx-6 mt-4 bg-gradient-to-r from-red-500/90 to-orange-500/90 backdrop-blur-xl rounded-2xl p-4 border border-white/20 animate-pulse">
              <div className="flex items-center gap-3">
                <Cloud className="w-8 h-8 text-white" />
                <div>
                  <p className="text-white font-bold">Weather Surge Active</p>
                  <p className="text-white/80 text-sm">{weatherSurge.condition} · {weatherSurge.surge}x pricing</p>
                </div>
              </div>
            </div>
          )}

          <div className="px-6 mt-6 flex gap-3">
            <button
              onClick={() => setAppMode('rides')}
              className={`flex-1 py-4 rounded-2xl font-bold transition-all flex flex-col items-center gap-2 ${
                appMode === 'rides'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl scale-105'
                  : 'bg-white/10 text-white/60'
              }`}
            >
              <Car className="w-6 h-6" />
              <span>{t.rides}</span>
            </button>
            <button
              onClick={() => setAppMode('food')}
              className={`flex-1 py-4 rounded-2xl font-bold transition-all flex flex-col items-center gap-2 ${
                appMode === 'food'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-2xl scale-105'
                  : 'bg-white/10 text-white/60'
              }`}
            >
              <UtensilsCrossed className="w-6 h-6" />
              <span>{t.food}</span>
            </button>
          </div>

          <div className="px-6 mt-6 grid grid-cols-3 gap-3 mb-6">
            <button 
              onClick={() => setShowScheduleModal(true)}
              className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4"
            >
              <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="text-white text-xs font-semibold">{t.schedule}</p>
            </button>
            <button className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
              <MapPinned className="w-8 h-8 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="text-white text-xs font-semibold">{t.multiStop}</p>
            </button>
            <button className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
              <Package className="w-8 h-8 text-yellow-400 mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="text-white text-xs font-semibold">Delivery</p>
            </button>
          </div>

          <div className="px-6 pb-6">
            {appMode === 'rides' && (
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
                <h2 className="text-2xl font-black text-gray-800 mb-4">{t.chooseRide}</h2>
                
                {/* Nearby Drivers */}
                <div className="mb-6">
                  <p className="text-sm font-bold text-gray-600 mb-3">Drivers Nearby</p>
                  <div className="space-y-2">
                    {nearbyDrivers.slice(0, 3).map(driver => (
                      <div key={driver.id} className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {driver.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{driver.name}</p>
                            <p className="text-xs text-gray-600">⭐ {driver.rating} • {driver.vehicle === 'bike' ? '🏍️' : '🚗'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-purple-600">{driver.distance}</p>
                          <p className="text-xs text-gray-600">{driver.eta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-3">Vehicle Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {vehicleOptions.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setRideVehicleType(opt.id)}
                        className={`p-4 rounded-2xl border-3 transition-all transform hover:scale-105 ${
                          rideVehicleType === opt.id
                            ? `bg-gradient-to-br ${opt.color} border-white shadow-2xl scale-105 text-white`
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className={`text-3xl mb-2 ${rideVehicleType === opt.id ? 'animate-bounce' : ''}`}>{opt.icon}</div>
                        <div className={`font-bold text-xs ${rideVehicleType === opt.id ? 'text-white' : 'text-gray-800'}`}>{opt.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder={t.whereTo}
                  className="w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl mb-4"
                />

                {fareEstimate && (
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white mb-4">
                    <div className="text-4xl font-black mb-2">{fareEstimate.fare} XAF</div>
                    <div className="text-sm">{fareEstimate.distance} km · {fareEstimate.duration} min</div>
                    <div className="mt-3 flex items-center gap-2 bg-white/20 rounded-lg p-2">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-sm">{paymentMethod === 'wallet' ? t.wallet : paymentMethod === 'mtn' ? t.mtnMoney : paymentMethod === 'orange' ? t.orangeMoney : t.cash}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={fareEstimate ? () => alert('Requesting ride...') : estimateFare}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-5 rounded-2xl font-bold shadow-2xl hover:scale-105 transition-all"
                >
                  {fareEstimate ? t.requestRide : t.getEstimate}
                </button>
              </div>
            )}

            {appMode === 'food' && (
              <div className="space-y-4">
                <input type="text" placeholder="Search restaurants..." className="w-full p-4 bg-white/95 rounded-2xl" />
                
                {restaurants.filter(r => r.popular).map(r => (
                  <button
                    key={r.id}
                    onClick={() => { setSelectedRestaurant(r); setView('restaurant'); }}
                    className="w-full bg-white/95 rounded-2xl p-4 flex items-center gap-4 hover:scale-105 transition-all shadow-xl"
                  >
                    <div className="text-5xl">{r.image}</div>
                    <div className="flex-1 text-left">
                      <h4 className="font-bold text-gray-800">{r.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          {r.rating}
                        </span>
                        <span>•</span>
                        <span>{r.time}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {cart.length > 0 && (
          <button
            onClick={() => setView('cart')}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-4 rounded-full shadow-2xl animate-bounce"
          >
            <ShoppingBag className="w-6 h-6 inline mr-2" />
            {cart.length} · {cartTotal} XAF
          </button>
        )}
      </div>
    );
  }

  if (view === 'restaurant' && selectedRestaurant) {
    const menu = menuItems[selectedRestaurant.id] || [];
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 pb-8 rounded-b-3xl">
          <button onClick={() => setView('home')} className="mb-4 p-2 bg-white/20 rounded-full">
            <X className="w-6 h-6" />
          </button>
          <div className="text-6xl mb-4">{selectedRestaurant.image}</div>
          <h2 className="text-3xl font-black">{selectedRestaurant.name}</h2>
        </div>

        <div className="p-6 space-y-4">
          {menu.map((item: any) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-lg">
              <div className="text-5xl">{item.image}</div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
                <p className="text-lg font-bold text-orange-600 mt-1">{item.price} XAF</p>
              </div>
              <button
                onClick={() => addToCart(item)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white w-10 h-10 rounded-full hover:scale-110 transition"
              >
                <Plus className="w-5 h-5 mx-auto" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
}