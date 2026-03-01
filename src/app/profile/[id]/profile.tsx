"use client";

import ProfileHeader from "./header";
import Listings from "./listings";
// import Reviews from "./review";
import About from "./about";
import MyProfile from "./my-profile";
import { useApp } from "@/providers/app-provider";
import { useParams } from "next/navigation";
import Link from "next/link";
import { UserCircle, LogIn, UserPlus, ShoppingBag, Sparkles } from "lucide-react";

function GuestProfilePrompt() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col">
      {/* Header bar */}
      <div className="bg-linear-to-br from-amber-500 via-amber-600 to-amber-700 dark:from-orange-600 dark:via-orange-700 dark:to-orange-800 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full" />
        <div className="relative z-10 px-5 pt-10 pb-8 lg:px-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center mx-auto mb-4">
            <UserCircle className="w-10 h-10 text-white/80" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Your Profile</h1>
          <p className="text-orange-100 text-sm">
            Sign in to access your profile, orders, and wallet
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 lg:px-12 py-8">
        {/* Feature highlights */}
        <div className="space-y-3 mb-8">
          {[
            { icon: ShoppingBag, text: "Track your orders and purchases" },
            { icon: Sparkles, text: "List products and services to sell" },
            { icon: UserCircle, text: "Build your seller profile and reputation" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-3 bg-white dark:bg-stone-900 rounded-xl p-4 border border-stone-200 dark:border-stone-800"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="space-y-3">
          <Link href="/auth/login" className="block">
            <div className="flex items-center justify-center gap-2 w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors shadow-sm">
              <LogIn className="w-4 h-4" />
              Sign In
            </div>
          </Link>
          <Link href="/auth/sign-up" className="block">
            <div className="flex items-center justify-center gap-2 w-full py-3.5 bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-semibold rounded-xl border-2 border-stone-200 dark:border-stone-700 hover:border-orange-400 dark:hover:border-orange-500 transition-colors">
              <UserPlus className="w-4 h-4" />
              Create Account
            </div>
          </Link>
        </div>

        {/* Browse link */}
        <p className="text-center text-sm text-stone-500 dark:text-stone-400 mt-6">
          Or{" "}
          <Link
            href="/view/category/all"
            className="text-orange-600 dark:text-orange-400 font-semibold hover:underline"
          >
            browse the marketplace
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useApp();
  // console.log(user);
  const params = useParams();

  // Guest visiting /profile/me — show sign-in prompt
  if (params.id === "me" && !user) {
    return <GuestProfilePrompt />;
  }

  // Logged-in user viewing their own profile (/profile/me)
  if (params.id === "me" && user) {
    return <MyProfile />;
  }

  // Viewing another user's profile
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <ProfileHeader />
      <About />
      {/* <Order /> */}
      <Listings />
      {/* <Reviews /> */}
    </div>
  );
}
