import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Loader className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
    </div>
  );
}
