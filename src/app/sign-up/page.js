import { Search, MessageCircle, User, Plus, Home, Heart, ShoppingBag, Menu, X, Filter, Star, MapPin, Clock, Send, ArrowLeft, Camera, DollarSign, Tag, Package, Users, Calendar, Shield, TrendingUp, BookOpen, Laptop, Sofa, Shirt, Ticket } from 'lucide-react';

export default function Page() {
  return (
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Adebayo Oluwaseun"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UI Email Address
            </label>
            <input
              type="email"
              placeholder="student@ui.edu.ng"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
            <div className="flex items-center gap-2 mt-2">
              <Shield className="w-4 h-4 text-green-600" />
              <p className="text-xs text-green-600 font-medium">
                Only @ui.edu.ng emails accepted
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="080XXXXXXXX"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hall of Residence (Optional)
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
          </div>

          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <label className="text-sm text-gray-600">
              I agree to the Terms of Service and Community Guidelines. I
              understand this is for UI students only.
            </label>
          </div>

          <button className="w-full py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition">
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="#" className="text-blue-900 font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
