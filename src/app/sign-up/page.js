"use client";

import { useState, useTransition } from "react";
import {
  ShoppingBag,
  Shield,
  Check,
  X,
  Loader,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useContext } from "react";
import { ShellContext } from "@/shell/shell";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const { supabase, setUser } = useContext(ShellContext);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    hallOfResidence: "",
    course: "",
    password: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  // UI Undergraduate Halls of Residence
  const hallsOfResidence = [
    // Female Halls
    { value: "queen-elizabeth", label: "Queen Elizabeth II Hall" },
    { value: "queen-idia", label: "Queen Idia Hall" },
    { value: "obafemi-awolowo", label: "Awo Hall" },
    // Male Halls
    { value: "mellanby", label: "Mellanby Hall" },
    { value: "tedder", label: "Tedder Hall" },
    { value: "kuti", label: "Kuti Hall" },
    { value: "sultan-bello", label: "Sultan Bello Hall" },
    { value: "independence", label: "Great Independence Hall" },
    { value: "nnamdi-azikiwe", label: "Nnamdi Azikiwe Hall" },
    // Mixed Halls
    {value: "alexander-brown-hall", label: "Alexander Brown Hall (ABH)" },
    // Off Campus
    { value: "off-campus", label: "Off Campus" },
  ];

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 3)
          return "Name must be at least 3 characters";
        if (!/^[a-zA-Z\s]+$/.test(value))
          return "Name can only contain letters";
        return "";

      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[a-zA-Z0-9._%+-]+@(stu|dlc)\.ui\.edu\.ng$/i.test(value)) {
          return "Must be a valid @stu.ui.edu.ng or @dlc.ui.edu.ng email address";
        }
        return "";

      case "phone":
        if (!value.trim()) return "Phone number is required";
        if (!/^(\+234|0)[789][01]\d{8}$/.test(value.replace(/\s/g, ""))) {
          return "Enter a valid Nigerian phone number (e.g., 08012345678)";
        }
        return "";

      case "hallOfResidence":
        if (!value) return "Please select your hall of residence";
        return "";

      case "course":
        if (!value.trim()) return "Course of study is required";
        if (value.trim().length < 2)
          return "Course name must be at least 2 characters";
        return "";

      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return "Must contain uppercase, lowercase, and number";
        }
        return "";

      case "agreeToTerms":
        if (!value) return "You must agree to the terms";
        return "";

      default:
        return "";
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, formData[field]);
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleSubmit = async () => {
    setError(null);
    // Touch all fields
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );

    setTouched(allTouched);

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    // If no errors, submit
    if (Object.keys(newErrors).length === 0) {
      try {
        // Create user with Supabase Auth
        const { data, error: signupError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              phone: formData.phone,
              hall_of_residence: formData.hallOfResidence,
              course: formData.course,
              institution: "University of Ibadan",
            },
          },
        });

        if (signupError) throw signupError;

        // Set user and redirect
        setUser(data.user);
        router.push("/onboarding/notification");
      } catch (error) {
        console.error("Signup error:", error);
        setError(error.message);
      }
    }
  };

  const getFieldState = (field) => {
    if (!touched[field]) return "default";
    return errors[field] ? "error" : "success";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 md:p-6 lg:p-8">
      <Card className="w-full max-w-md lg:max-w-lg xl:max-w-xl dark:bg-gray-800 dark:border-gray-700">
        {/* Static */}
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 md:gap-3">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-900 dark:bg-blue-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <span className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-400">
              Markeet
            </span>
          </div>
          <CardTitle className="dark:text-white text-xl md:text-2xl">
            Create an account
          </CardTitle>
          <CardDescription className="dark:text-gray-400 text-sm md:text-base">
            Join University of Ibadan's Campus Marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* This is the part that need  */}
          <FieldGroup>
            {/* Full Name */}
            <Field>
              <FieldLabel htmlFor="name" className="dark:text-gray-200">
                Full Name *
              </FieldLabel>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder="Adebayo Femi"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  onBlur={() => handleBlur("fullName")}
                  className={`text-sm md:text-base ${
                    getFieldState("fullName") === "error"
                      ? "border-red-500 focus-visible:ring-red-200 dark:border-red-400 dark:focus-visible:ring-red-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      : getFieldState("fullName") === "success"
                      ? "border-green-500 focus-visible:ring-green-200 dark:border-green-400 dark:focus-visible:ring-green-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      : "dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
                  }`}
                  required
                />
                {getFieldState("fullName") === "success" && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600 dark:text-green-400" />
                )}
                {getFieldState("fullName") === "error" && (
                  <X className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              {touched.fullName && errors.fullName && (
                <FieldDescription className="text-red-600 dark:text-red-400 flex items-center gap-1 text-xs md:text-sm">
                  <AlertCircle className="w-3 h-3" />
                  {errors.fullName}
                </FieldDescription>
              )}
            </Field>

            {/* Email */}
            <Field>
              <FieldLabel htmlFor="email" className="dark:text-gray-200">
                UI Student Email *
              </FieldLabel>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="student@stu.ui.edu.ng"
                  value={formData.email}
                  onChange={(e) =>
                    handleChange("email", e.target.value.toLowerCase())
                  }
                  onBlur={() => handleBlur("email")}
                  className={`text-sm md:text-base ${
                    getFieldState("email") === "error"
                      ? "border-red-500 focus-visible:ring-red-200 dark:border-red-400 dark:focus-visible:ring-red-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      : getFieldState("email") === "success"
                      ? "border-green-500 focus-visible:ring-green-200 dark:border-green-400 dark:focus-visible:ring-green-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      : "dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
                  }`}
                  required
                />
                {getFieldState("email") === "success" && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600 dark:text-green-400" />
                )}
                {getFieldState("email") === "error" && (
                  <X className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              {touched.email && errors.email ? (
                <FieldDescription className="text-red-600 dark:text-red-400 flex items-center gap-1 text-xs md:text-sm">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </FieldDescription>
              ) : (
                <FieldDescription className="flex items-center gap-1 dark:text-gray-400 text-xs md:text-sm">
                  <Shield className="w-3 h-3 text-green-600 dark:text-green-400" />
                  Only @stu.ui.edu.ng emails accepted
                </FieldDescription>
              )}
            </Field>

            {/* Hall of Residence */}
            <Field>
              <FieldLabel
                htmlFor="hallOfResidence"
                className="dark:text-gray-200 text-sm md:text-base"
              >
                Hall of Residence *
              </FieldLabel>
              <Select
                value={formData.hallOfResidence}
                onValueChange={(value) => {
                  handleChange("hallOfResidence", value);
                  setTouched({ ...touched, hallOfResidence: true });
                }}
              >
                <SelectTrigger
                  className={`text-sm md:text-base ${
                    getFieldState("hallOfResidence") === "error"
                      ? "border-red-500 focus:ring-red-200 dark:border-red-400 dark:focus:ring-red-900 dark:bg-gray-700 dark:text-white"
                      : getFieldState("hallOfResidence") === "success"
                      ? "border-green-500 focus:ring-green-200 dark:border-green-400 dark:focus:ring-green-900 dark:bg-gray-700 dark:text-white"
                      : "dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  }`}
                >
                  <SelectValue placeholder="Select your hall of residence" />
                </SelectTrigger>
                <SelectContent>
                  {hallsOfResidence.map((hall) => (
                    <SelectItem key={hall.value} value={hall.value}>
                      {hall.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {touched.hallOfResidence && errors.hallOfResidence ? (
                <FieldDescription className="text-red-600 dark:text-red-400 flex items-center gap-1 text-xs md:text-sm">
                  <AlertCircle className="w-3 h-3" />
                  {errors.hallOfResidence}
                </FieldDescription>
              ) : (
                <FieldDescription className="dark:text-gray-400 text-xs md:text-sm">
                  Select your hall or choose "Off Campus"
                </FieldDescription>
              )}
            </Field>

            {/* Course */}
            <Field>
              <FieldLabel htmlFor="course" className="dark:text-gray-200">
                Course of Study *
              </FieldLabel>
              <div className="relative">
                <Input
                  id="course"
                  type="text"
                  placeholder="e.g., Computer Science, Medicine, Law"
                  value={formData.course}
                  onChange={(e) => handleChange("course", e.target.value)}
                  onBlur={() => handleBlur("course")}
                  className={`text-sm md:text-base ${
                    getFieldState("course") === "error"
                      ? "border-red-500 focus-visible:ring-red-200 dark:border-red-400 dark:focus-visible:ring-red-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      : getFieldState("course") === "success"
                      ? "border-green-500 focus-visible:ring-green-200 dark:border-green-400 dark:focus-visible:ring-green-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      : "dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
                  }`}
                  required
                />
                {getFieldState("course") === "success" && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600 dark:text-green-400" />
                )}
                {getFieldState("course") === "error" && (
                  <X className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              {touched.course && errors.course && (
                <FieldDescription className="text-red-600 dark:text-red-400 flex items-center gap-1 text-xs md:text-sm">
                  <AlertCircle className="w-3 h-3" />
                  {errors.course}
                </FieldDescription>
              )}
            </Field>

            {/* Phone Number */}
            <Field>
              <FieldLabel
                htmlFor="phone"
                className="dark:text-gray-200 text-sm md:text-base"
              >
                Phone Number *
              </FieldLabel>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="08012345678"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  className={`text-sm md:text-base ${
                    getFieldState("phone") === "error"
                      ? "border-red-500 focus-visible:ring-red-200 dark:border-red-400 dark:focus-visible:ring-red-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      : getFieldState("phone") === "success"
                      ? "border-green-500 focus-visible:ring-green-200 dark:border-green-400 dark:focus-visible:ring-green-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      : "dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
                  }`}
                  required
                />
                {getFieldState("phone") === "success" && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600 dark:text-green-400" />
                )}
                {getFieldState("phone") === "error" && (
                  <X className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              {touched.phone && errors.phone ? (
                <FieldDescription className="text-red-600 dark:text-red-400 flex items-center gap-1 text-xs md:text-sm">
                  <AlertCircle className="w-3 h-3" />
                  {errors.phone}
                </FieldDescription>
              ) : (
                <FieldDescription className="dark:text-gray-400 text-xs md:text-sm">
                  Nigerian phone number (080, 070, 090 format)
                </FieldDescription>
              )}
            </Field>

            {/* Password with Toggle Visibility */}
            <Field>
              <FieldLabel
                htmlFor="password"
                className="dark:text-gray-200 text-sm md:text-base"
              >
                Password *
              </FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`text-sm md:text-base ${
                    getFieldState("password") === "error"
                      ? "border-red-500 focus-visible:ring-red-200 pr-20 dark:border-red-400 dark:focus-visible:ring-red-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      : getFieldState("password") === "success"
                      ? "border-green-500 focus-visible:ring-green-200 pr-20 dark:border-green-400 dark:focus-visible:ring-green-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      : "pr-20 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
                  }`}
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {getFieldState("password") === "success" && (
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  )}
                  {getFieldState("password") === "error" && (
                    <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              {touched.password && errors.password ? (
                <FieldDescription className="text-red-600 dark:text-red-400 flex items-center gap-1 text-xs md:text-sm">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </FieldDescription>
              ) : (
                <FieldDescription className="dark:text-gray-400 text-xs md:text-sm">
                  Min. 8 characters with uppercase, lowercase, and number
                </FieldDescription>
              )}
            </Field>

            {/* Terms Agreement */}
            <Field>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) =>
                    handleChange("agreeToTerms", e.target.checked)
                  }
                  onBlur={() => handleBlur("agreeToTerms")}
                  className="mt-1 w-4 h-4 text-blue-900 dark:text-blue-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded focus:ring-blue-900 dark:focus:ring-blue-600"
                  required
                />
                <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  I agree to the Terms of Service and Community Guidelines. I
                  understand this platform is for verified University of Ibadan
                  students only.
                </span>
              </label>
              {touched.agreeToTerms && errors.agreeToTerms && (
                <FieldDescription className="text-red-600 dark:text-red-400 flex items-center gap-1 ml-7 text-xs md:text-sm">
                  <AlertCircle className="w-3 h-3" />
                  {errors.agreeToTerms}
                </FieldDescription>
              )}
            </Field>

            {/* Submit Button */}
            <Field>
              <Button
                type="button"
                onClick={() => startTransition(handleSubmit)}
                disabled={isPending}
                className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white text-sm md:text-base py-2 md:py-3"
              >
                {isPending ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              <FieldDescription className="text-center dark:text-gray-400 text-xs md:text-sm">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-900 dark:text-blue-400 font-semibold hover:underline"
                >
                  Sign in
                </a>
              </FieldDescription>
            </Field>
          </FieldGroup>
          {error && (
            <div className="grid w-full max-w-xl items-start gap-4 mt-4">
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>
                  <p>{error}</p>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
