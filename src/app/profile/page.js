import { Search, MessageCircle, User, Plus, Home, Heart, ShoppingBag, Menu, X, Filter, Star, MapPin, Clock, Send, ArrowLeft, Camera, DollarSign, Tag, Package, Users, Calendar, Shield, TrendingUp, BookOpen, Laptop, Sofa, Shirt, Ticket } from 'lucide-react';

export default function Page() {
  return (
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
              <p className="text-sm text-gray-500 mb-3">
                4th Year • Engineering • Mellanby Hall
              </p>
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
                {
                  name: "Engineering Mathematics",
                  price: 18000,
                  status: "Active",
                  views: 45,
                },
                {
                  name: "Study Desk & Chair",
                  price: 12000,
                  status: "Active",
                  views: 32,
                },
                {
                  name: "iPhone Charger",
                  price: 3000,
                  status: "Sold",
                  views: 28,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-xl hover:shadow-md transition"
                >
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-xl relative">
                    <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-lg text-sm font-bold text-blue-900">
                      ₦{item.price.toLocaleString()}
                    </div>
                    <div
                      className={`absolute top-2 left-2 px-3 py-1 rounded-lg text-xs font-medium ${
                        item.status === "Active"
                          ? "bg-green-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {item.status}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {item.views} views • Posted 2 days ago
                    </p>
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
}
