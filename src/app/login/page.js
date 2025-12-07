"use client";

import React, { useState } from "react";
import { ShoppingBag, Eye, EyeOff, Loader2 } from "lucide-react";
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

export default function LoginForm({ ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Login submitted:", formData);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card
        {...props}
        className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700"
      >
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-blue-900 dark:bg-blue-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-blue-900 dark:text-blue-400">
              Markeet
            </span>
          </div>
          <CardTitle className="text-2xl dark:text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Login to your campus marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            {/* Email Field */}
            <Field>
              <FieldLabel htmlFor="email" className="dark:text-gray-200">
                Student Email
              </FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="student@unilag.edu.ng"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
                required
              />
              <FieldDescription className="dark:text-gray-400">
                Use your .edu.ng email address
              </FieldDescription>
            </Field>

            {/* Password Field */}
            <Field>
              <div className="flex items-center justify-between mb-2">
                <FieldLabel htmlFor="password" className="dark:text-gray-200">
                  Password
                </FieldLabel>
                <a
                  href="#"
                  className="text-sm text-blue-900 dark:text-blue-400 hover:underline"
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
                  className="pr-12 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
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

            {/* Remember Me */}
            <Field>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) =>
                    setFormData({ ...formData, rememberMe: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-900 dark:text-blue-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded focus:ring-blue-900 dark:focus:ring-blue-600"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Remember me
                </span>
              </label>
            </Field>

            {/* Login Button */}
            <Field>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              <FieldDescription className="text-center dark:text-gray-400">
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
  );
}
