import { Search, MessageCircle, User, Plus, Home, Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
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
    </footer>
  );
}
