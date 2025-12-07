"use client"

import { useState, useEffect } from "react";
import { Search, ShoppingBag, Shield, Check, X, Loader2 } from "lucide-react";

// Mock data for nigerian-institutions package
// In your actual Next.js app, you'll import: import institutions from 'nigerian-institutions';
const mockInstitutions = {
  allSchools: () => [
    { name: "University of Ibadan", city: "Ibadan", code: "UI" },
    { name: "University of Lagos", city: "Lagos", code: "UNILAG" },
    { name: "Obafemi Awolowo University", city: "Ile-Ife", code: "OAU" },
    { name: "Ahmadu Bello University", city: "Zaria", code: "ABU" },
    { name: "University of Nigeria, Nsukka", city: "Nsukka", code: "UNN" },
    { name: "University of Benin", city: "Benin City", code: "UNIBEN" },
    { name: "Lagos State University", city: "Lagos", code: "LASU" },
    { name: "Covenant University", city: "Ota", code: "CU" },
    {
      name: "Federal University of Technology, Akure",
      city: "Akure",
      code: "FUTA",
    },
    { name: "University of Ilorin", city: "Ilorin", code: "UNILORIN" },
    { name: "Yaba College of Technology", city: "Lagos", code: "YABATECH" },
    {
      name: "Federal Polytechnic, Ile-Oluji",
      city: "Ile-Oluji",
      code: "FEDPOLEL",
    },
    { name: "Kaduna Polytechnic", city: "Kaduna", code: "KADPOLY" },
    {
      name: "University of Port Harcourt",
      city: "Port Harcourt",
      code: "UNIPORT",
    },
    { name: "Rivers State University", city: "Port Harcourt", code: "RSU" },
  ],
  search: (query) => {
    const all = mockInstitutions.allSchools();
    const q = query.toLowerCase();
    return all.filter(
      (school) =>
        school.name.toLowerCase().includes(q) ||
        school.city.toLowerCase().includes(q) ||
        school.code.toLowerCase().includes(q)
    );
  },
};

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    institution: null,
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Institution search state
  const [institutionSearch, setInstitutionSearch] = useState("");
  const [institutionResults, setInstitutionResults] = useState([]);
  const [showInstitutionDropdown, setShowInstitutionDropdown] = useState(false);

  // Search institutions as user types
  useEffect(() => {
    if (institutionSearch.length > 0) {
      const results = mockInstitutions.search(institutionSearch);
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
          return "Enter a valid Nigerian phone number";
        }
        return "";

      case "institution":
        if (!value) return "Please select your institution";
        return "";

      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return "Password must contain uppercase, lowercase, and number";
        }
        return "";

      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
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
    setErrors({ ...errors, institution: "" });
    setTouched({ ...touched, institution: true });
  };

  const handleSubmit = async () => {
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
      setIsSubmitting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      // In real app: navigate to verification page or dashboard
      alert("Account created successfully! Check your email for verification.");
    }
  };

  const getFieldState = (field) => {
    if (!touched[field]) return "default";
    return errors[field] ? "error" : "success";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-blue-900">Markeet</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Join Markeet</h2>
          <p className="text-gray-600 mt-2">Nigeria's student marketplace</p>
        </div>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                onBlur={() => handleBlur("fullName")}
                placeholder="Adebayo Oluwaseun"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                  getFieldState("fullName") === "error"
                    ? "border-red-500 focus:ring-red-200"
                    : getFieldState("fullName") === "success"
                    ? "border-green-500 focus:ring-green-200"
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-900"
                }`}
              />
              {getFieldState("fullName") === "success" && (
                <Check className="absolute right-3 top-3.5 w-5 h-5 text-green-600" />
              )}
              {getFieldState("fullName") === "error" && (
                <X className="absolute right-3 top-3.5 w-5 h-5 text-red-600" />
              )}
            </div>
            {touched.fullName && errors.fullName && (
              <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  handleChange("email", e.target.value.toLowerCase())
                }
                onBlur={() => handleBlur("email")}
                placeholder="student@unilag.edu.ng"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                  getFieldState("email") === "error"
                    ? "border-red-500 focus:ring-red-200"
                    : getFieldState("email") === "success"
                    ? "border-green-500 focus:ring-green-200"
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-900"
                }`}
              />
              {getFieldState("email") === "success" && (
                <Check className="absolute right-3 top-3.5 w-5 h-5 text-green-600" />
              )}
              {getFieldState("email") === "error" && (
                <X className="absolute right-3 top-3.5 w-5 h-5 text-red-600" />
              )}
            </div>
            {touched.email && errors.email ? (
              <p className="text-red-600 text-xs mt-1">{errors.email}</p>
            ) : (
              <div className="flex items-center gap-2 mt-2">
                <Shield className="w-4 h-4 text-green-600" />
                <p className="text-xs text-green-600 font-medium">
                  Only .edu.ng emails accepted
                </p>
              </div>
            )}
          </div>

          {/* Institution - Autocomplete */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institution *
            </label>
            <div className="relative">
              <div className="relative">
                <input
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
                      handleBlur("institution");
                    }, 200);
                  }}
                  onFocus={() => {
                    if (institutionSearch.length > 0) {
                      setShowInstitutionDropdown(true);
                    }
                  }}
                  placeholder="Search for your university, polytechnic, or college..."
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:outline-none transition ${
                    getFieldState("institution") === "error"
                      ? "border-red-500 focus:ring-red-200"
                      : getFieldState("institution") === "success"
                      ? "border-green-500 focus:ring-green-200"
                      : "border-gray-300 focus:ring-blue-200 focus:border-blue-900"
                  }`}
                />
                <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>

              {/* Dropdown Results */}
              {showInstitutionDropdown && institutionResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {institutionResults.map((school, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectInstitution(school)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-0 transition"
                    >
                      <div className="font-medium text-gray-900">
                        {school.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {school.city} • {school.code}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {showInstitutionDropdown &&
                institutionSearch.length > 0 &&
                institutionResults.length === 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                    <p className="text-sm text-gray-600">
                      No institutions found. Try a different search.
                    </p>
                  </div>
                )}
            </div>
            {touched.institution && errors.institution && (
              <p className="text-red-600 text-xs mt-1">{errors.institution}</p>
            )}
            {formData.institution && (
              <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                <Check className="w-4 h-4 text-blue-900" />
                <span className="text-sm text-blue-900 font-medium">
                  {formData.institution.name}
                </span>
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                placeholder="08012345678"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                  getFieldState("phone") === "error"
                    ? "border-red-500 focus:ring-red-200"
                    : getFieldState("phone") === "success"
                    ? "border-green-500 focus:ring-green-200"
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-900"
                }`}
              />
              {getFieldState("phone") === "success" && (
                <Check className="absolute right-3 top-3.5 w-5 h-5 text-green-600" />
              )}
              {getFieldState("phone") === "error" && (
                <X className="absolute right-3 top-3.5 w-5 h-5 text-red-600" />
              )}
            </div>
            {touched.phone && errors.phone && (
              <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                  getFieldState("password") === "error"
                    ? "border-red-500 focus:ring-red-200"
                    : getFieldState("password") === "success"
                    ? "border-green-500 focus:ring-green-200"
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-900"
                }`}
              />
              {getFieldState("password") === "success" && (
                <Check className="absolute right-3 top-3.5 w-5 h-5 text-green-600" />
              )}
              {getFieldState("password") === "error" && (
                <X className="absolute right-3 top-3.5 w-5 h-5 text-red-600" />
              )}
            </div>
            {touched.password && errors.password ? (
              <p className="text-red-600 text-xs mt-1">{errors.password}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Min. 8 characters with uppercase, lowercase, and number
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                onBlur={() => handleBlur("confirmPassword")}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                  getFieldState("confirmPassword") === "error"
                    ? "border-red-500 focus:ring-red-200"
                    : getFieldState("confirmPassword") === "success"
                    ? "border-green-500 focus:ring-green-200"
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-900"
                }`}
              />
              {getFieldState("confirmPassword") === "success" && (
                <Check className="absolute right-3 top-3.5 w-5 h-5 text-green-600" />
              )}
              {getFieldState("confirmPassword") === "error" && (
                <X className="absolute right-3 top-3.5 w-5 h-5 text-red-600" />
              )}
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-red-600 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms Agreement */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleChange("agreeToTerms", e.target.checked)}
                onBlur={() => handleBlur("agreeToTerms")}
                className="mt-1 w-4 h-4 text-blue-900 border-gray-300 rounded focus:ring-blue-900"
              />
              <span className="text-sm text-gray-600">
                I agree to the Terms of Service and Community Guidelines. I
                understand this platform is for verified Nigerian students only.
              </span>
            </label>
            {touched.agreeToTerms && errors.agreeToTerms && (
              <p className="text-red-600 text-xs mt-1 ml-7">
                {errors.agreeToTerms}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="#" className="text-blue-900 font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
