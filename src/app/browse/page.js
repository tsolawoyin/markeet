import { Search, MessageCircle, User, Plus, Home, Heart, ShoppingBag, Menu, X, Filter, Star, MapPin, Clock, Send, ArrowLeft, Camera, DollarSign, Tag, Package, Users, Calendar, Shield, TrendingUp, BookOpen, Laptop, Sofa, Shirt, Ticket } from 'lucide-react';

export default function Page() {
  return (
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
                <div className="text-xs text-gray-600">
                  UI Campus Marketplace
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Heart className="w-6 h-6 text-gray-600" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <MessageCircle className="w-6 h-6 text-gray-600" />
                <span className="absolute top-0 right-0 w-5 h-5 bg-blue-900 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
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
            {
              name: "Engineering Mathematics",
              price: 15000,
              category: "Textbooks",
              hall: "Mellanby",
              rating: 4.8,
            },
            {
              name: "HP Laptop Core i5",
              price: 85000,
              category: "Electronics",
              hall: "Tedder",
              rating: 4.9,
            },
            {
              name: "Study Desk & Chair",
              price: 12000,
              category: "Furniture",
              hall: "Sultan Bello",
              rating: 4.7,
            },
            {
              name: "Concert Ticket",
              price: 3000,
              category: "Tickets",
              hall: "Independence",
              rating: 5.0,
            },
            {
              name: "iPhone 12 Pro",
              price: 250000,
              category: "Electronics",
              hall: "Queen Idia",
              rating: 4.6,
            },
            {
              name: "Chemistry Textbook Set",
              price: 22000,
              category: "Textbooks",
              hall: "Mellanby",
              rating: 4.8,
            },
            {
              name: "Mini Fridge",
              price: 35000,
              category: "Electronics",
              hall: "Tedder",
              rating: 4.9,
            },
            {
              name: "Tutoring Service - Math",
              price: 5000,
              category: "Services",
              hall: "Off Campus",
              rating: 5.0,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-xl relative">
                <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-lg text-sm font-bold text-blue-900">
                  ₦{item.price.toLocaleString()}
                </div>
                <div className="absolute bottom-2 left-2 bg-blue-900 text-white px-2 py-1 rounded text-xs">
                  {item.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.name}
                </h3>
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
}
