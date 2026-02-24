import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 px-5">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
            Email verification failed
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-2">
            The verification link is invalid or has expired. Please try signing
            up again.
          </p>
        </div>
        <Link
          href="/sign-up"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition"
        >
          Back to Sign Up
        </Link>
      </div>
    </div>
  );
}
