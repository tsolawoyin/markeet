import { Search, MessageCircle, User, Plus, Home, Heart, ShoppingBag, Menu, X, Filter, Star, MapPin, Clock, Send, ArrowLeft, Camera, DollarSign, Tag, Package, Users, Calendar, Shield, TrendingUp, BookOpen, Laptop, Sofa, Shirt, Ticket } from 'lucide-react';

export default function Page() {
  return (
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
              {
                name: "Chioma Okonkwo",
                msg: "Is the textbook still available?",
                time: "2h",
                unread: true,
              },
              {
                name: "Ibrahim Yusuf",
                msg: "Can we meet at the library?",
                time: "5h",
                unread: false,
              },
              {
                name: "Amaka Eze",
                msg: "Thanks for the laptop!",
                time: "1d",
                unread: false,
              },
              {
                name: "Tunde Adeyemi",
                msg: "What's the lowest price?",
                time: "2d",
                unread: false,
              },
              {
                name: "Fatima Hassan",
                msg: "I'll take it!",
                time: "3d",
                unread: true,
              },
            ].map((chat, i) => (
              <div
                key={i}
                className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                  i === 0 ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-blue-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`font-semibold ${
                          chat.unread ? "text-blue-900" : "text-gray-900"
                        }`}
                      >
                        {chat.name}
                      </span>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        chat.unread
                          ? "text-blue-900 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {chat.msg}
                    </p>
                    {chat.unread && (
                      <span className="inline-block w-2 h-2 bg-blue-900 rounded-full mt-1"></span>
                    )}
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
                  <p className="text-gray-900">
                    Hi! Is the Engineering textbook still available?
                  </p>
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
                  <p className="text-gray-900">
                    Great! Can we meet at the library tomorrow at 3pm?
                  </p>
                  <span className="text-xs text-gray-500">10:35 AM</span>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <div className="bg-blue-900 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-md">
                  <p>
                    Perfect! I'll be at the main entrance. I'll bring the book.
                  </p>
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
}
