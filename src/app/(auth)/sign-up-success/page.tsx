import { Mail } from "lucide-react";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; ref?: string }>;
}) {
  const { email, ref: referrerId } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 px-5">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
          <Mail className="w-8 h-8 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
            Check your email
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-2">
            We sent a verification link to{" "}
            {email ? (
              <span className="font-semibold text-stone-900 dark:text-white">
                {email}
              </span>
            ) : (
              "your email"
            )}
          </p>
        </div>
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 text-left space-y-3">
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Click the link in the email to verify your account and get started
            on Markeet.
          </p>
          <p className="text-sm text-stone-500 dark:text-stone-500">
            Didn&apos;t receive the email? Check your spam folder or try signing
            up again.
          </p>
        </div>
        <Link
          href={
            referrerId ? `/sign-up?ref=${referrerId}` : "/sign-up"
          }
          className="text-sm text-orange-500 font-semibold hover:underline"
        >
          Back to Sign Up
        </Link>
      </div>
    </div>
  );
}
