"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
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
import { useRouter } from "next/navigation";
import { debug } from "@/utils/debug";

export default function ResetPasswordPage() {
  const { supabase } = useApp();
//   const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  // Check if user arrived via a valid reset link (Supabase sets the session automatically)
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsValidSession(!!session);
      setIsChecking(false);
    };

    // Listen for the PASSWORD_RECOVERY event
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsValidSession(true);
        setIsChecking(false);
      }
    });

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSubmit = async () => {
    setError(null);

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError("Password must contain uppercase, lowercase, and a number");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (updateError) throw updateError;

      setIsSuccess(true);
    } catch (error: any) {
      debug.error("Password update error:", error);
      setError(error.message);
    }
  };

  const onSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    startTransition(handleSubmit);
  };

  // Loading state while checking session
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Verifying your reset link...
          </p>
        </div>
      </div>
    );
  }

  // Invalid or expired link
  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 px-5">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">
            Invalid or Expired Link
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <Link href="/forgot-password">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm py-2.5 mb-3">
              Request New Link
            </Button>
          </Link>
          <Link
            href="/login"
            className="inline-block text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

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
            Almost there!
            <br />
            Set your new password.
          </h2>
          <p className="text-orange-100 max-w-sm">
            Choose a strong password to keep your account secure. Make sure it
            has at least 8 characters with a mix of letters and numbers.
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
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-orange-100 text-sm mt-1 max-w-65">
              Choose a new password for your account.
            </p>
          </div>
        </div>

        {/* ─── Desktop Header (hidden on mobile) ───────────────────── */}
        <div className="hidden lg:block px-12 pt-10">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
              Reset Password
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Enter your new password below
            </p>
          </div>
        </div>

        {/* ─── Form / Success ────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col lg:flex-none px-5 lg:px-12 pt-8 lg:pt-8 pb-4">
          <div className="w-full max-w-md lg:max-w-md">
            {isSuccess ? (
              /* ─── Success State ──────────────────────────────────── */
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">
                  Password Updated
                </h2>
                <p className="text-sm text-stone-500 dark:text-stone-400 mb-6 max-w-xs mx-auto">
                  Your password has been changed successfully. You can now sign
                  in with your new password.
                </p>
                <Link href="/login">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm py-2.5">
                    Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              /* ─── Password Form ──────────────────────────────────── */
              <form onSubmit={onSubmit}>
                <FieldGroup>
                  {/* New Password */}
                  <Field>
                    <FieldLabel
                      htmlFor="password"
                      className="dark:text-stone-200 text-sm"
                    >
                      New Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            password: e.target.value,
                          })
                        }
                        className="pr-12 dark:bg-stone-800 dark:text-white dark:border-stone-700 dark:placeholder-stone-400 text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded transition"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                        )}
                      </button>
                    </div>
                    <FieldDescription className="dark:text-stone-400 text-xs">
                      Min. 8 characters with uppercase, lowercase, and number
                    </FieldDescription>
                  </Field>

                  {/* Confirm Password */}
                  <Field>
                    <FieldLabel
                      htmlFor="confirm-password"
                      className="dark:text-stone-200 text-sm"
                    >
                      Confirm Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="pr-12 dark:bg-stone-800 dark:text-white dark:border-stone-700 dark:placeholder-stone-400 text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded transition"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                        )}
                      </button>
                    </div>
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
                          Updating password...
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
