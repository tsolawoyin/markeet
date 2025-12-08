"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Search,
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

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import nigerianInstitutions from "nigerian-institutions";

import { useContext } from "react";
import { ShellContext } from "@/shell/shell";
import { useRouter } from "next/navigation";

export default function SignupForm({ ...props }) {
  const { supabase, setUser } = useContext(ShellContext);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    institution: null,
    password: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  // Institution search state
  const [institutionSearch, setInstitutionSearch] = useState("");
  const [institutionResults, setInstitutionResults] = useState([]);
  const [showInstitutionDropdown, setShowInstitutionDropdown] = useState(false);

  const router = useRouter();

  // Search institutions as user types
  useEffect(() => {
    if (institutionSearch.length > 0) {
      const results = nigerianInstitutions.search(institutionSearch);
      setInstitutionResults(results);
      setShowInstitutionDropdown(true);
    } else {
      setInstitutionResults([]);
      setShowInstitutionDropdown(false);
    }
  }, [institutionSearch]);

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
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.ng$/i.test(value)) {
          return "Must be a valid .edu.ng email address";
        }
        return "";

      case "phone":
        if (!value.trim()) return "Phone number is required";
        if (!/^(\+234|0)[789][01]\d{8}$/.test(value.replace(/\s/g, ""))) {
          return "Enter a valid Nigerian phone number (e.g., 08012345678)";
        }
        return "";

      case "institution":
        if (!value) return "Please select your institution";
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

  const selectInstitution = (school) => {
    setFormData({ ...formData, institution: school });
    setInstitutionSearch(school.name);
    setShowInstitutionDropdown(false);
    // Mark as touched and clear error immediately on selection
    setTouched({ ...touched, institution: true });
    setErrors({ ...errors, institution: "" });
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
              institution_name: formData.institution.name,
              institution_code: formData.institution.code,
              institution_city: formData.institution.city,
            },
          },
        });

        if (signupError) throw signupError;

        // console.log("User created:", data.user?.id);
        // This is compulsory
        setUser(data.user);
        router.push("/browse");
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
      <Card
        {...props}
        className="w-full max-w-md lg:max-w-lg xl:max-w-xl dark:bg-gray-800 dark:border-gray-700"
      >
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 md:gap-3">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-900 dark:bg-blue-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <span className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-400">
              Markeet
            </span>
          </div>
          <CardTitle className="dark:text-white text-xl md:text-2xl">Create an account</CardTitle>
          <CardDescription className="dark:text-gray-400 text-sm md:text-base">
            Join Nigeria's verified student marketplace
          </CardDescription>
        </CardHeader>
        <form
          action={async function () {
            startTransition(handleSubmit);
          }}
        >
          <CardContent>
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
                    placeholder="Adebayo Oluwaseun"
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
                  Student Email *
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@unilag.edu.ng"
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
                    Only .edu.ng emails accepted
                  </FieldDescription>
                )}
              </Field>

              {/* Institution Autocomplete */}
              <Field>
                <FieldLabel
                  htmlFor="institution"
                  className="dark:text-gray-200 text-sm md:text-base"
                >
                  Institution *
                </FieldLabel>
                <div className="relative">
                  <div className="relative">
                    <Input
                      id="institution"
                      type="text"
                      value={institutionSearch}
                      onChange={(e) => {
                        setInstitutionSearch(e.target.value);
                        if (!e.target.value) {
                          setFormData({ ...formData, institution: null });
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setShowInstitutionDropdown(false);
                          // Only validate on blur if no institution is selected
                          if (!formData.institution) {
                            handleBlur("institution");
                          }
                        }, 200);
                      }}
                      onFocus={() => {
                        if (institutionSearch.length > 0) {
                          setShowInstitutionDropdown(true);
                        }
                      }}
                      placeholder="Search university, polytechnic, or college..."
                      className={`text-sm md:text-base ${
                        getFieldState("institution") === "error"
                          ? "border-red-500 focus-visible:ring-red-200 pr-10 dark:border-red-400 dark:focus-visible:ring-red-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                          : getFieldState("institution") === "success"
                          ? "border-green-500 focus-visible:ring-green-200 pr-10 dark:border-green-400 dark:focus-visible:ring-green-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                          : "pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
                      }`}
                      required
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </div>

                  {showInstitutionDropdown && institutionResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {institutionResults.map((school, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => selectInstitution(school)}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-0 transition"
                        >
                          <div className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                            {school.name}
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                            {school.city} • {school.code}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {showInstitutionDropdown &&
                    institutionSearch.length > 0 &&
                    institutionResults.length === 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4">
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          No institutions found. Try a different search.
                        </p>
                      </div>
                    )}
                </div>

                {touched.institution && errors.institution ? (
                  <FieldDescription className="text-red-600 dark:text-red-400 flex items-center gap-1 text-xs md:text-sm">
                    <AlertCircle className="w-3 h-3" />
                    {errors.institution}
                  </FieldDescription>
                ) : formData.institution ? (
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <Check className="w-4 h-4 text-blue-900 dark:text-blue-400" />
                    <span className="text-xs md:text-sm text-blue-900 dark:text-blue-400 font-medium">
                      {formData.institution.name}
                    </span>
                  </div>
                ) : (
                  <FieldDescription className="dark:text-gray-400 text-xs md:text-sm">
                    Type to search all Nigerian universities, polytechnics, and
                    colleges
                  </FieldDescription>
                )}
              </Field>

              {/* Phone Number */}
              <Field>
                <FieldLabel htmlFor="phone" className="dark:text-gray-200 text-sm md:text-base">
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
                <FieldLabel htmlFor="password" className="dark:text-gray-200 text-sm md:text-base">
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
                    understand this platform is for verified Nigerian students
                    only.
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
                  type="submit"
                  variant={"default"}
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
        </form>
      </Card>
    </div>
  );
}