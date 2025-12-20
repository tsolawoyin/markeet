"use client";

import React, { useState, useTransition } from "react";
import { ShoppingBag, Eye, EyeOff, Loader, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useContext } from "react";
import { ShellContext } from "@/shell/shell";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const { supabase, setUser } = useContext(ShellContext);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Email validation for UI students
  const isValidUIEmail = (email) => {
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
        "Please use your University of Ibadan student email (@stu.ui.edu.ng)"
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

      // Set the user in context
      setUser(data.user);

      // Redirect to home
      router.push("/browse");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 md:gap-3">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-900 dark:bg-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
              <span className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-400">
                Markeet
              </span>
            </div>
            <CardDescription className="text-sm md:text-base dark:text-gray-400">
              University of Ibadan Campus Marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              {/* Email Field */}
              <Field>
                <FieldLabel
                  htmlFor="email"
                  className="dark:text-gray-200 text-sm md:text-base"
                >
                  UI Student Email
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
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 text-sm md:text-base"
                  required
                />
                <FieldDescription className="dark:text-gray-400 text-xs md:text-sm">
                  Use your @stu.ui.edu.ng email address
                </FieldDescription>
              </Field>

              {/* Password Field */}
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel
                    htmlFor="password"
                    className="dark:text-gray-200 text-sm md:text-base"
                  >
                    Password
                  </FieldLabel>
                  <a
                    href="#"
                    className="text-xs md:text-sm text-blue-900 dark:text-blue-400 hover:underline"
                  >
                    Forgot password?
                  </a>
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
                    className="pr-12 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 text-sm md:text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    )}
                  </button>
                </div>
              </Field>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription className="text-xs md:text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Login Button */}
              <Field>
                <Button
                  type="button"
                  disabled={isPending}
                  onClick={() => startTransition(handleSubmit)}
                  className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white text-sm md:text-base py-2 md:py-3"
                >
                  {isPending ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
                <FieldDescription className="text-center dark:text-gray-400 text-xs md:text-sm">
                  Don't have an account?{" "}
                  <a
                    href="/sign-up"
                    className="text-blue-900 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Sign up
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
