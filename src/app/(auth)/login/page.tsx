"use client";

import { useState, useTransition } from "react";
import {
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
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
import { useRouter, useSearchParams } from "next/navigation";
import { debug } from "@/utils/debug";

export default function LoginForm() {
  const { supabase, setUser } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const referrerId = searchParams.get("ref");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  // Email validation for UI students
  const isValidUIEmail = (email: string): boolean => {
    return (
      email.toLowerCase().endsWith("@stu.ui.edu.ng") ||
      email.toLowerCase().endsWith("@dlc.ui.edu.ng")
    );
  };

  const handleSubmit = async () => {
    setError(null);

    // Validate UI email
    if (!isValidUIEmail(formData.email)) {
      setError(
        "Please use your University of Ibadan student email (@stu.ui.edu.ng)",
      );
      return;
    }

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (signInError) throw signInError;

      // If email is not verified, resend verification and redirect
      if (!data.user.email_confirmed_at) {
        await supabase.auth.resend({ type: "signup", email: formData.email });
        await supabase.auth.signOut();
        const params = new URLSearchParams({ email: formData.email });
        router.push(`/sign-up-success?${params.toString()}`);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data?.user?.id)
        .single();

      const { data: about, error: aboutError } = await supabase
        .from("about")
        .select("*")
        .eq("user_id", data?.user?.id)
        .single();

      setUser({
        id: data.user.id,
        profile: profile,
        user: data.user,
        about: about,
      });

      // Redirect to home
      router.push("/");
    } catch (error: any) {
      debug.error("Login error:", error);
      setError(error.message);
    }
  };

  const onSubmit = (e: React.SubmitEvent) => {
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
            Welcome back to
            <br />
            your campus marketplace.
          </h2>
          <p className="text-orange-100 max-w-sm">
            Pick up right where you left off.
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
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-orange-100 text-sm mt-1 max-w-65">
              Sign in to continue buying and selling on campus.
            </p>
          </div>
        </div>

        {/* ─── Desktop Header (hidden on mobile) ───────────────────── */}
        <div className="hidden lg:block px-12 pt-10">
          <div className="max-w-md">
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-1">
              Welcome back
            </p>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
              Login to <span className="text-orange-500">Markeet</span>
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Pick up where you left off
            </p>
          </div>
        </div>

        {/* ─── Form ────────────────────────────────────────────────── */}
        <form
          onSubmit={onSubmit}
          className="flex-1 flex flex-col lg:flex-none px-5 lg:px-12 pt-8 lg:pt-8 pb-4"
        >
          <div className="w-full max-w-md lg:max-w-md">
            <FieldGroup>
              {/* Email Field */}
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
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value.toLowerCase(),
                    })
                  }
                  className="dark:bg-stone-800 dark:text-white dark:border-stone-700 dark:placeholder-stone-400 text-sm"
                  required
                />
                <FieldDescription className="dark:text-stone-400 text-xs">
                  Use your @stu.ui.edu.ng email
                </FieldDescription>
              </Field>

              {/* Password Field */}
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel
                    htmlFor="password"
                    className="dark:text-stone-200 text-sm"
                  >
                    Password
                  </FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-orange-500 font-medium hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
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
              </Field>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription className="text-xs">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Login Button */}
              <Field>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm py-2.5"
                >
                  {isPending ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Field>
            </FieldGroup>

            <p className="text-center text-stone-600 dark:text-stone-400 text-sm mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href={referrerId ? `/sign-up?ref=${referrerId}` : "/sign-up"}
                className="text-orange-500 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
