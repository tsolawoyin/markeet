"use client";

import { useState, useTransition } from "react";
import {
  Loader,
  AlertCircle,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { useApp } from "@/providers/app-provider";
import { debug } from "@/utils/debug";

export default function ForgotPasswordPage() {
  const { supabase } = useApp();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isValidUIEmail = (email: string): boolean => {
    return (
      email.toLowerCase().endsWith("@stu.ui.edu.ng") ||
      email.toLowerCase().endsWith("@dlc.ui.edu.ng")
    );
  };

  const handleSubmit = async () => {
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!isValidUIEmail(email)) {
      setError(
        "Please use your University of Ibadan student email (@stu.ui.edu.ng)",
      );
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        },
      );

      if (resetError) throw resetError;

      setIsSubmitted(true);
    } catch (error: any) {
      debug.error("Password reset error:", error);
      if (error.message?.includes("rate limit")) {
        setError(
          "Too many requests. Please wait a few minutes before trying again.",
        );
      } else {
        setError(error.message);
      }
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(handleSubmit);
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* ─── Desktop Brand Panel ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:flex-col lg:justify-between bg-linear-to-br from-orange-500 via-orange-600 to-orange-700 dark:from-orange-600 dark:via-orange-700 dark:to-orange-800 p-12 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 right-12 w-40 h-40 bg-white/5 rounded-full" />

        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Markeet</h1>
          <p className="text-orange-100 mt-1 text-sm">Student Marketplace</p>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-2xl font-bold leading-tight">
            Don&apos;t worry,
            <br />
            we&apos;ve got you covered.
          </h2>
          <p className="text-orange-100 max-w-sm">
            Enter your student email and we&apos;ll send you a link to reset
            your password. You&apos;ll be back in no time.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-sm">Verified Students Only</p>
              <p className="text-orange-200 text-xs">
                UI email verification required
              </p>
            </div>
          </div>
          {/* <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-sm">Escrow Protection</p>
              <p className="text-orange-200 text-xs">
                Payments held until delivery confirmed
              </p>
            </div>
          </div> */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-sm">Campus Community</p>
              <p className="text-orange-200 text-xs">
                Trade with students you know and trust
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Form Panel ──────────────────────────────────────────────── */}
      <div className="flex flex-col min-h-screen lg:min-h-0 bg-stone-50 dark:bg-stone-950 lg:justify-center lg:overflow-y-auto">
        {/* ─── Mobile Brand Header ───────────────────────────────────── */}
        <div className="lg:hidden bg-linear-to-br from-orange-500 via-orange-600 to-orange-700 dark:from-orange-600 dark:via-orange-700 dark:to-orange-800 px-6 pt-10 pb-8 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full" />
          <div className="relative z-10">
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            <p className="text-orange-100 text-sm mt-1 max-w-65">
              No worries, we&apos;ll send you a reset link.
            </p>
          </div>
        </div>

        {/* ─── Desktop Header (hidden on mobile) ───────────────────── */}
        <div className="hidden lg:block px-12 pt-10">
          <div className="max-w-md">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
              Forgot Password
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Enter your email to receive a reset link
            </p>
          </div>
        </div>

        {/* ─── Form / Success ────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col lg:flex-none px-5 lg:px-12 pt-8 lg:pt-8 pb-4">
          <div className="w-full max-w-md lg:max-w-md">
            {isSubmitted ? (
              /* ─── Success State ──────────────────────────────────── */
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">
                  Check your email
                </h2>
                <p className="text-sm text-stone-500 dark:text-stone-400 mb-2 max-w-xs mx-auto">
                  We&apos;ve sent a password reset link to:
                </p>
                <p className="text-sm font-semibold text-stone-900 dark:text-white mb-6">
                  {email}
                </p>
                <div className="bg-stone-100 dark:bg-stone-900 rounded-xl p-4 mb-6 text-left">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-stone-900 dark:text-white mb-1">
                        Didn&apos;t receive the email?
                      </p>
                      <ul className="text-xs text-stone-500 dark:text-stone-400 space-y-1">
                        <li>Check your spam or junk folder</li>
                        <li>Make sure you entered the correct email</li>
                        <li>The link expires in 1 hour</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                  variant="outline"
                  className="w-full mb-3 dark:bg-stone-900 dark:border-stone-800 dark:text-stone-200 dark:hover:bg-stone-800"
                >
                  Try a different email
                </Button>

                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-orange-500 font-semibold hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </div>
            ) : (
              /* ─── Email Form ─────────────────────────────────────── */
              <form onSubmit={onSubmit}>
                <FieldGroup>
                  {/* Mobile back link */}
                  <div className="lg:hidden">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to login
                    </Link>
                  </div>

                  <Field>
                    <FieldLabel
                      htmlFor="email"
                      className="dark:text-stone-200 text-sm"
                    >
                      Student Email
                    </FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@stu.ui.edu.ng"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.toLowerCase())}
                      className="dark:bg-stone-800 dark:text-white dark:border-stone-700 dark:placeholder-stone-400 text-sm"
                      required
                    />
                    <FieldDescription className="dark:text-stone-400 text-xs">
                      Enter the email you used to create your account
                    </FieldDescription>
                  </Field>

                  {/* Error Alert */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription className="text-xs">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Field>
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm py-2.5"
                    >
                      {isPending ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin mr-2" />
                          Sending reset link...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </Field>
                </FieldGroup>

                <p className="text-center text-stone-600 dark:text-stone-400 text-sm mt-6">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="text-orange-500 font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
