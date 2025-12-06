import { Search, MessageCircle, User, Plus, Home, Heart, ShoppingBag, Menu, X, Filter, Star, MapPin, Clock, Send, ArrowLeft, Camera, DollarSign, Tag, Package, Users, Calendar, Shield, TrendingUp, BookOpen, Laptop, Sofa, Shirt, Ticket } from 'lucide-react';

export default function Page() {
  return (
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
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-lg"
                ></div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Engineering Mathematics Textbook
                </h1>
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
                Comprehensive engineering mathematics textbook in excellent
                condition. Used for only one semester. No highlighting or torn
                pages. Perfect for current students taking ENG 201. Includes all
                chapters and practice problems.
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
                  <div className="text-sm text-gray-600 mb-1">
                    4th Year, Engineering
                  </div>
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
                  <div className="font-semibold text-blue-900 mb-1">
                    Safe Campus Meetup
                  </div>
                  <p className="text-gray-700">
                    Always meet in public campus locations. Suggested: UI
                    Library, Student Union Building, Faculty entrances.
                  </p>
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
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-xl relative">
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-lg text-sm font-semibold">
                    ₦{16000 + i * 1000}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Engineering Book Vol {i}
                  </h3>
                  <p className="text-sm text-gray-600">Good condition</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
