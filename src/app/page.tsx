"use client";

import React, { useState } from 'react';
import { Search, MessageCircle, User, Plus, Home, Heart, ShoppingBag, Menu, X, Filter, Star, MapPin, Clock, Send, ArrowLeft, Camera, DollarSign, Tag, Package, Users, Calendar, Shield, TrendingUp, BookOpen, Laptop, Sofa, Shirt, Ticket } from 'lucide-react';

const MockupViewer = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // UI Royal Blue Theme Colors
  const colors = {
    primary: '#1e40af', // Royal Blue (UI Logo Color)
    primaryLight: '#3b82f6',
    primaryDark: '#1e3a8a',
    accent: '#0ea5e9',
    success: '#10b981',
    warning: '#f59e0b'
  };

  const pages = [
    { id: 'landing', name: 'Landing Page', icon: Home },
    { id: 'signup', name: 'Sign Up', icon: User },
    { id: 'login', name: 'Login', icon: User },
    { id: 'browse', name: 'Browse/Home', icon: ShoppingBag },
    { id: 'details', name: 'Listing Details', icon: Package },
    { id: 'create', name: 'Create Listing', icon: Plus },
    { id: 'messages', name: 'Messages', icon: MessageCircle },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'community', name: 'Campus Chat', icon: Users },
    { id: 'events', name: 'Events', icon: Calendar }
  ];

  // Landing Page
  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-blue-900">UITrade</span>
              <div className="text-xs text-gray-600">Verified Student Marketplace</div>
            </div>
          </div>
          <div className="hidden md:flex gap-4">
            <button className="px-4 py-2 text-gray-700 hover:text-blue-900">How it Works</button>
            <button className="px-4 py-2 text-gray-700 hover:text-blue-900">Safety</button>
            <button className="px-4 py-2 border border-blue-900 text-blue-900 rounded-lg hover:bg-blue-50">Login</button>
            <button className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">Sign Up</button>
          </div>
          <button className="md:hidden"><Menu className="w-6 h-6" /></button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-900 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            UI Students Only - 100% Verified
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Trusted<br />Campus Marketplace
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            Buy, sell, and rent from verified UI students. Safe, convenient, and built for your campus community.
          </p>
          <p className="text-blue-900 font-semibold mb-8">Join 2,500+ UI Students Already Trading</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-blue-900 text-white rounded-lg text-lg font-semibold hover:bg-blue-800 shadow-lg">
              Start Browsing
            </button>
            <button className="px-8 py-4 border-2 border-blue-900 text-blue-900 rounded-lg text-lg font-semibold hover:bg-blue-50">
              Post Your First Item
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid md:grid-cols-4 gap-6 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-3xl font-bold text-blue-900 mb-2">2,500+</div>
            <div className="text-sm text-gray-600">Verified Students</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-3xl font-bold text-blue-900 mb-2">8,000+</div>
            <div className="text-sm text-gray-600">Items Traded</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-3xl font-bold text-blue-900 mb-2">4.8★</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">99%</div>
            <div className="text-sm text-gray-600">Safe Transactions</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-900" />
            </div>
            <h3 className="text-xl font-bold mb-2">100% Verified Students</h3>
            <p className="text-gray-600">Only UI students with @ui.edu.ng emails. No strangers, no scammers.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Safe In-App Chat</h3>
            <p className="text-gray-600">Message buyers and sellers securely without sharing personal contacts.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Campus Meetups</h3>
            <p className="text-gray-600">Meet at safe zones on campus - library, SUB, or designated meeting points.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Campus Community Chat</h3>
            <p className="text-gray-600">Join hall-specific and faculty groups to connect with your community.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-blue-900" />
            </div>
            <h3 className="text-xl font-bold mb-2">Event Tickets</h3>
            <p className="text-gray-600">Buy and sell tickets to campus events, parties, and programs safely.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Rent & Services</h3>
            <p className="text-gray-600">Rent items or offer services like tutoring, typing, and more.</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20 bg-white rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-12">How UITrade Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-bold text-lg mb-2">Sign Up with UI Email</h3>
              <p className="text-gray-600">Create account using your @ui.edu.ng email for instant verification</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-bold text-lg mb-2">Browse or Post Items</h3>
              <p className="text-gray-600">Search for items you need or list what you want to sell or rent</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-bold text-lg mb-2">Chat & Meet on Campus</h3>
              <p className="text-gray-600">Message securely and meet at safe campus locations to complete transaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Sign Up Page
  const SignUpPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-blue-900">UITrade</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Join UITrade</h2>
          <p className="text-gray-600 mt-2">Your verified campus marketplace</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Adebayo Oluwaseun"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">UI Email Address</label>
            <input
              type="email"
              placeholder="student@ui.edu.ng"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
            <div className="flex items-center gap-2 mt-2">
              <Shield className="w-4 h-4 text-green-600" />
              <p className="text-xs text-green-600 font-medium">Only @ui.edu.ng emails accepted</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              placeholder="080XXXXXXXX"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hall of Residence (Optional)</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent">
              <option>Select your hall</option>
              <option>Mellanby Hall</option>
              <option>Tedder Hall</option>
              <option>Sultan Bello Hall</option>
              <option>Independence Hall</option>
              <option>Queen Elizabeth Hall</option>
              <option>Obafemi Awolowo Hall</option>
              <option>Off Campus</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
          </div>

          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <label className="text-sm text-gray-600">
              I agree to the Terms of Service and Community Guidelines. I understand this is for UI students only.
            </label>
          </div>

          <button className="w-full py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition">
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account? <a href="#" className="text-blue-900 font-semibold hover:underline">Login</a>
        </p>
      </div>
    </div>
  );

  // Login Page
  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-blue-900">UITrade</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Login to your campus marketplace</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">UI Email</label>
            <input
              type="email"
              placeholder="student@ui.edu.ng"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-900 hover:underline">Forgot password?</a>
          </div>

          <button className="w-full py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition">
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account? <a href="#" className="text-blue-900 font-semibold hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );

  // Browse/Home Page
  const BrowsePage = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-blue-900">UITrade</span>
                <div className="text-xs text-gray-600">UI Campus Marketplace</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Heart className="w-6 h-6 text-gray-600" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <MessageCircle className="w-6 h-6 text-gray-600" />
                <span className="absolute top-0 right-0 w-5 h-5 bg-blue-900 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <User className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search textbooks, electronics, furniture..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
            </div>
            <button className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline">Post</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Quick Categories with Icons */}
        <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-6">
          <button className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-900" />
            </div>
            <span className="text-xs font-medium">Textbooks</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl hover:shadow-md transition">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Laptop className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-medium">Electronics</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl hover:shadow-md transition">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Sofa className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs font-medium">Furniture</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl hover:shadow-md transition">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Shirt className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-medium">Clothing</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl hover:shadow-md transition">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Ticket className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-xs font-medium">Tickets</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl hover:shadow-md transition">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Tag className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xs font-medium">Services</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl hover:shadow-md transition">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-gray-600" />
            </div>
            <span className="text-xs font-medium">All</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Latest Items</h2>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Listings Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[
            { name: 'Engineering Mathematics', price: 15000, category: 'Textbooks', hall: 'Mellanby', rating: 4.8 },
            { name: 'HP Laptop Core i5', price: 85000, category: 'Electronics', hall: 'Tedder', rating: 4.9 },
            { name: 'Study Desk & Chair', price: 12000, category: 'Furniture', hall: 'Sultan Bello', rating: 4.7 },
            { name: 'Concert Ticket', price: 3000, category: 'Tickets', hall: 'Independence', rating: 5.0 },
            { name: 'iPhone 12 Pro', price: 250000, category: 'Electronics', hall: 'Queen Idia', rating: 4.6 },
            { name: 'Chemistry Textbook Set', price: 22000, category: 'Textbooks', hall: 'Mellanby', rating: 4.8 },
            { name: 'Mini Fridge', price: 35000, category: 'Electronics', hall: 'Tedder', rating: 4.9 },
            { name: 'Tutoring Service - Math', price: 5000, category: 'Services', hall: 'Off Campus', rating: 5.0 }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-xl relative">
                <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-lg text-sm font-bold text-blue-900">
                  ₦{item.price.toLocaleString()}
                </div>
                <div className="absolute bottom-2 left-2 bg-blue-900 text-white px-2 py-1 rounded text-xs">
                  {item.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{item.hall}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{item.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{Math.floor(Math.random() * 24)}h ago</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
        <div className="flex justify-around py-3">
          <button className="flex flex-col items-center gap-1 text-blue-900">
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-600">
            <Search className="w-6 h-6" />
            <span className="text-xs">Search</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-600">
            <Plus className="w-6 h-6" />
            <span className="text-xs">Post</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-600">
            <Users className="w-6 h-6" />
            <span className="text-xs">Campus</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-600 relative">
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs">Messages</span>
            <span className="absolute top-0 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-600">
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );

  // Listing Details Page
  const DetailsPage = () => (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="text-xl font-bold">Item Details</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-4"></div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Engineering Mathematics Textbook</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>Mellanby Hall</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Posted 2h ago</span>
                  </div>
                </div>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm font-medium">
                  Textbooks
                </span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Heart className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="text-4xl font-bold text-blue-900 mb-6">₦18,000</div>

            <div className="border-t border-b border-gray-200 py-4 mb-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">
                Comprehensive engineering mathematics textbook in excellent condition. Used for only one semester.
                No highlighting or torn pages. Perfect for current students taking ENG 201. Includes all chapters and practice problems.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Condition</span>
                <span className="font-semibold text-green-600">Like New</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Category</span>
                <span className="font-semibold">Textbooks</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Meetup Location</span>
                <span className="font-semibold">UI Library</span>
              </div>
            </div>

            {/* Seller Info with Verification */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="font-semibold mb-4">Seller Information</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-7 h-7 text-blue-900" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-semibold">Adebayo Oluwaseun</div>
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-sm text-gray-600 mb-1">4th Year, Engineering</div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">4.8</span>
                    <span className="text-gray-500">(23 transactions)</span>
                  </div>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  View Profile
                </button>
              </div>
            </div>

            {/* Safe Meetup Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-900 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-semibold text-blue-900 mb-1">Safe Campus Meetup</div>
                  <p className="text-gray-700">Always meet in public campus locations. Suggested: UI Library, Student Union Building, Faculty entrances.</p>
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 flex items-center justify-center gap-2 mb-3">
              <MessageCircle className="w-5 h-5" />
              Message Seller
            </button>

            <button className="w-full py-3 border-2 border-blue-900 text-blue-900 rounded-lg font-semibold hover:bg-blue-50 flex items-center justify-center gap-2">
              <Shield className="w-5 h-5" />
              Report Listing
            </button>
          </div>
        </div>

        {/* Similar Items */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Items</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-xl relative">
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-lg text-sm font-semibold">
                    ₦{16000 + i * 1000}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Engineering Book Vol {i}</h3>
                  <p className="text-sm text-gray-600">Good condition</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Create Listing Page
  const CreateListingPage = () => (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <span className="text-xl font-bold">Create Listing</span>
          </div>
          <button className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">
            Publish
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block font-semibold mb-3">Photos (Required)</label>
            <div className="grid grid-cols-4 gap-4">
              <div className="aspect-square border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-900 cursor-pointer bg-blue-50">
                <Camera className="w-8 h-8 text-blue-900 mb-2" />
                <span className="text-sm text-blue-900 font-medium">Add Photo</span>
              </div>
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Add up to 8 photos. First photo will be the cover image.</p>
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold mb-2">Title *</label>
            <input
              type="text"
              placeholder="e.g., Engineering Mathematics Textbook"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-2">Description *</label>
            <textarea
              rows={5}
              placeholder="Describe your item: condition, why you're selling, included items, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
          </div>

          {/* Category & Type */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Category *</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent">
                <option>Select category</option>
                <option>Textbooks & Books</option>
                <option>Electronics & Gadgets</option>
                <option>Furniture & Appliances</option>
                <option>Clothing & Fashion</option>
                <option>Event Tickets</option>
                <option>Services & Tutoring</option>
                <option>Sports & Fitness</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">Listing Type *</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent">
                <option>For Sale</option>
                <option>For Rent</option>
                <option>Service Offered</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block font-semibold mb-2">Price (₦) *</label>
            <input
              type="number"
              placeholder="18000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">Set a fair price. Be honest about the condition.</p>
          </div>

          {/* Condition */}
          <div>
            <label className="block font-semibold mb-2">Condition *</label>
            <div className="grid grid-cols-4 gap-2">
              {['Brand New', 'Like New', 'Good', 'Fair'].map(cond => (
                <button key={cond} className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-900 hover:bg-blue-50 text-sm font-medium">
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Meetup Location */}
          <div>
            <label className="block font-semibold mb-2">Preferred Meetup Location *</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent">
              <option>Select safe campus location</option>
              <option>UI Main Library</option>
              <option>Student Union Building</option>
              <option>Faculty of Science</option>
              <option>Faculty of Engineering</option>
              <option>Faculty of Arts</option>
              <option>Mellanby Hall</option>
              <option>Tedder Hall</option>
              <option>Other (Specify in description)</option>
            </select>
            <div className="flex items-start gap-2 mt-2 p-3 bg-blue-50 rounded-lg">
              <Shield className="w-4 h-4 text-blue-900 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-700">Always meet in public campus locations for safety</p>
            </div>
          </div>

          {/* Hall/Location */}
          <div>
            <label className="block font-semibold mb-2">Your Hall/Location</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent">
              <option>Select location</option>
              <option>Mellanby Hall</option>
              <option>Tedder Hall</option>
              <option>Sultan Bello Hall</option>
              <option>Independence Hall</option>
              <option>Queen Elizabeth Hall</option>
              <option>Off Campus - Bodija</option>
              <option>Off Campus - Sango</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  // Messages Page
  const MessagesPage = () => (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Messages</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto h-[calc(100vh-80px)]">
        <div className="grid lg:grid-cols-3 h-full">
          {/* Conversations List */}
          <div className="bg-white border-r border-gray-200 overflow-y-auto">
            {[
              { name: 'Chioma Okonkwo', msg: 'Is the textbook still available?', time: '2h', unread: true },
              { name: 'Ibrahim Yusuf', msg: 'Can we meet at the library?', time: '5h', unread: false },
              { name: 'Amaka Eze', msg: 'Thanks for the laptop!', time: '1d', unread: false },
              { name: 'Tunde Adeyemi', msg: 'What\'s the lowest price?', time: '2d', unread: false },
              { name: 'Fatima Hassan', msg: 'I\'ll take it!', time: '3d', unread: true }
            ].map((chat, i) => (
              <div key={i} className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${i === 0 ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-blue-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-semibold ${chat.unread ? 'text-blue-900' : 'text-gray-900'}`}>{chat.name}</span>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <p className={`text-sm truncate ${chat.unread ? 'text-blue-900 font-medium' : 'text-gray-600'}`}>{chat.msg}</p>
                    {chat.unread && <span className="inline-block w-2 h-2 bg-blue-900 rounded-full mt-1"></span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-900" />
                </div>
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    Chioma Okonkwo
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-sm text-gray-500">Active now</div>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm hover:bg-blue-800">
                View Listing
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-900" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 max-w-md">
                  <p className="text-gray-900">Hi! Is the Engineering textbook still available?</p>
                  <span className="text-xs text-gray-500">10:30 AM</span>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <div className="bg-blue-900 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-md">
                  <p>Yes, it's still available! Are you interested?</p>
                  <span className="text-xs text-blue-200">10:32 AM</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-900" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 max-w-md">
                  <p className="text-gray-900">Great! Can we meet at the library tomorrow at 3pm?</p>
                  <span className="text-xs text-gray-500">10:35 AM</span>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <div className="bg-blue-900 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-md">
                  <p>Perfect! I'll be at the main entrance. I'll bring the book.</p>
                  <span className="text-xs text-blue-200">10:37 AM</span>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Profile Page
  const ProfilePage = () => (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">My Profile</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-blue-900" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h2 className="text-2xl font-bold">Adebayo Oluwaseun</h2>
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-gray-600 mb-1">student@ui.edu.ng</p>
              <p className="text-sm text-gray-500 mb-3">4th Year • Engineering • Mellanby Hall</p>
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-gray-500">(23 reviews)</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600">Joined Oct 2024</span>
              </div>
              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-900 mb-1">12</div>
            <div className="text-gray-600">Active Listings</div>
          </div>
          <div className="bg-white rounded-xl p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">28</div>
            <div className="text-gray-600">Items Sold</div>
          </div>
          <div className="bg-white rounded-xl p-6">
            <div className="text-3xl font-bold text-purple-600 mb-1">15</div>
            <div className="text-gray-600">Items Bought</div>
          </div>
          <div className="bg-white rounded-xl p-6">
            <div className="text-3xl font-bold text-orange-600 mb-1">5</div>
            <div className="text-gray-600">Favorites</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button className="px-6 py-4 border-b-2 border-blue-900 text-blue-900 font-semibold whitespace-nowrap">
                My Listings
              </button>
              <button className="px-6 py-4 text-gray-600 hover:text-gray-900 whitespace-nowrap">
                Favorites
              </button>
              <button className="px-6 py-4 text-gray-600 hover:text-gray-900 whitespace-nowrap">
                Sold Items
              </button>
              <button className="px-6 py-4 text-gray-600 hover:text-gray-900 whitespace-nowrap">
                Reviews
              </button>
            </div>
          </div>

          {/* Listings */}
          <div className="p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Engineering Mathematics', price: 18000, status: 'Active', views: 45 },
                { name: 'Study Desk & Chair', price: 12000, status: 'Active', views: 32 },
                { name: 'iPhone Charger', price: 3000, status: 'Sold', views: 28 }
              ].map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-xl hover:shadow-md transition">
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-xl relative">
                    <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-lg text-sm font-bold text-blue-900">
                      ₦{item.price.toLocaleString()}
                    </div>
                    <div className={`absolute top-2 left-2 px-3 py-1 rounded-lg text-xs font-medium ${item.status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                      {item.status}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.views} views • Posted 2 days ago</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                        Edit
                      </button>
                      <button className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Campus Chat Page (New Rumie Feature)
  const CommunityPage = () => (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Campus Community</h1>
          <p className="text-sm text-gray-600">Connect with UI students</p>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Community Tabs */}
        <div className="bg-white rounded-xl p-4 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            <button className="px-4 py-2 bg-blue-900 text-white rounded-lg whitespace-nowrap">General Chat</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 whitespace-nowrap">Mellanby Hall</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 whitespace-nowrap">Engineering</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 whitespace-nowrap">Looking for Roommates</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 whitespace-nowrap">Study Groups</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Posts Feed */}
          <div className="lg:col-span-2 space-y-4">
            {/* Create Post */}
            <div className="bg-white rounded-xl p-4">
              <textarea
                placeholder="Share something with the UI community..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent mb-3"
                rows={3}
              />
              <button className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">Post</button>
            </div>

            {/* Community Posts */}
            {[
              { author: 'Chioma Okonkwo', time: '2h', content: 'Anyone selling a desk lamp? Mellanby Hall area preferred', replies: 5 },
              { author: 'Ibrahim Yusuf', time: '4h', content: 'Looking for a study partner for ENG 301. DM me!', replies: 12 },
              { author: 'Amaka Eze', time: '6h', content: 'Where can I get affordable printing on campus?', replies: 8 }
            ].map((post, i) => (
              <div key={i} className="bg-white rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-900" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{post.author}</span>
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-500">• {post.time} ago</span>
                    </div>
                    <p className="text-gray-800">{post.content}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <button className="flex items-center gap-1 hover:text-blue-900">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.replies} replies</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-900">
                    <Heart className="w-4 h-4" />
                    <span>Like</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold mb-4">Community Guidelines</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Be respectful to all students</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>No spam or self-promotion</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Report suspicious activity</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-bold text-blue-900 mb-2">Active Users</h3>
              <p className="text-2xl font-bold text-blue-900">256</p>
              <p className="text-sm text-gray-600">UI students online now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Events Page (New Rumie Feature)
  const EventsPage = () => (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Campus Events</h1>
            <p className="text-sm text-gray-600">Discover and buy event tickets</p>
          </div>
          <button className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">
            Post Event
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Event Categories */}
        <div className="flex gap-2 overflow-x-auto mb-6">
          {['All Events', 'Parties', 'Academic', 'Sports', 'Cultural', 'Career'].map(cat => (
            <button key={cat} className={`px-4 py-2 rounded-lg whitespace-nowrap ${cat === 'All Events' ? 'bg-blue-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Event */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-8 mb-8 text-white">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-3">Featured Event</span>
              <h2 className="text-3xl font-bold mb-2">UI Student Week 2024</h2>
              <p className="mb-4">The biggest campus celebration of the year!</p>
              <div className="flex items-center gap-4 text-sm mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Dec 15-20, 2024</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>UI Main Field</span>
                </div>
              </div>
              <button className="px-6 py-3 bg-white text-blue-900 rounded-lg font-semibold hover:bg-gray-100">
                Get Tickets - ₦2,500
              </button>
            </div>
            <div className="aspect-video bg-white/10 rounded-xl"></div>
          </div>
        </div>

        {/* Upcoming Events */}
        <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Engineering Night Party', date: 'Dec 12', price: 1500, location: 'Off Campus' },
            { name: 'Career Fair 2024', date: 'Dec 18', price: 0, location: 'SUB Hall' },
            { name: 'Faculty of Arts Concert', date: 'Dec 20', price: 2000, location: 'Arts Theatre' },
            { name: 'Tech Meetup & Networking', date: 'Dec 22', price: 500, location: 'ICT Center' },
            { name: 'Christmas Carol Night', date: 'Dec 24', price: 1000, location: 'Chapel' },
            { name: 'New Year Bash 2025', date: 'Dec 31', price: 3500, location: 'TBA' }
          ].map((event, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100"></div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{event.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-900">
                    {event.price === 0 ? 'FREE' : `₦${event.price.toLocaleString()}`}
                  </span>
                  <button className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 text-sm">
                    Get Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'landing': return <LandingPage />;
      case 'signup': return <SignUpPage />;
      case 'login': return <LoginPage />;
      case 'browse': return <BrowsePage />;
      case 'details': return <DetailsPage />;
      case 'create': return <CreateListingPage />;
      case 'messages': return <MessagesPage />;
      case 'profile': return <ProfilePage />;
      case 'community': return <CommunityPage />;
      case 'events': return <EventsPage />;
      default: return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Selector */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-blue-900">UITrade - Complete MVP Mockups</h1>
              <p className="text-xs text-gray-600">UI Royal Blue Theme • Rumie-Inspired Features</p>
            </div>
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-wrap gap-2`}>
            {pages.map(page => {
              const Icon = page.icon;
              return (
                <button
                  key={page.id}
                  onClick={() => {
                    setCurrentPage(page.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${currentPage === page.id
                      ? 'bg-blue-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {page.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="bg-white">
        {renderPage()}
      </div>
    </div>
  );
};

export default MockupViewer;