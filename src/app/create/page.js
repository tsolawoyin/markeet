import { Search, MessageCircle, User, Plus, Home, Heart, ShoppingBag, Menu, X, Filter, Star, MapPin, Clock, Send, ArrowLeft, Camera, DollarSign, Tag, Package, Users, Calendar, Shield, TrendingUp, BookOpen, Laptop, Sofa, Shirt, Ticket } from 'lucide-react';

export default function Page() {
  return (
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
            <label className="block font-semibold mb-3">
              Photos (Required)
            </label>
            <div className="grid grid-cols-4 gap-4">
              <div className="aspect-square border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-900 cursor-pointer bg-blue-50">
                <Camera className="w-8 h-8 text-blue-900 mb-2" />
                <span className="text-sm text-blue-900 font-medium">
                  Add Photo
                </span>
              </div>
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Add up to 8 photos. First photo will be the cover image.
            </p>
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
            <p className="text-sm text-gray-500 mt-1">
              Set a fair price. Be honest about the condition.
            </p>
          </div>

          {/* Condition */}
          <div>
            <label className="block font-semibold mb-2">Condition *</label>
            <div className="grid grid-cols-4 gap-2">
              {["Brand New", "Like New", "Good", "Fair"].map((cond) => (
                <button
                  key={cond}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-900 hover:bg-blue-50 text-sm font-medium"
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Meetup Location */}
          <div>
            <label className="block font-semibold mb-2">
              Preferred Meetup Location *
            </label>
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
              <p className="text-xs text-gray-700">
                Always meet in public campus locations for safety
              </p>
            </div>
          </div>

          {/* Hall/Location */}
          <div>
            <label className="block font-semibold mb-2">
              Your Hall/Location
            </label>
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
}
