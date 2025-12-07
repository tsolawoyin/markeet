"use client"

import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Shield, Check, X, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

// Mock data for nigerian-institutions package
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
    { name: "Federal University of Technology, Akure", city: "Akure", code: "FUTA" },
    { name: "University of Ilorin", city: "Ilorin", code: "UNILORIN" },
    { name: "Yaba College of Technology", city: "Lagos", code: "YABATECH" },
    { name: "Federal Polytechnic, Ile-Oluji", city: "Ile-Oluji", code: "FEDPOLEL" },
    { name: "Kaduna Polytechnic", city: "Kaduna", code: "KADPOLY" },
    { name: "University of Port Harcourt", city: "Port Harcourt", code: "UNIPORT" },
    { name: "Rivers State University", city: "Port Harcourt", code: "RSU" }
  ],
  search: (query) => {
    const all = mockInstitutions.allSchools();
    const q = query.toLowerCase();
    return all.filter(school =>
      school.name.toLowerCase().includes(q) ||
      school.city.toLowerCase().includes(q) ||
      school.code.toLowerCase().includes(q)
    );
  }
};

export default function SignupForm({ ...props }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institution: null,
    password: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Institution search state
  const [institutionSearch, setInstitutionSearch] = useState('');
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
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 3) return 'Name must be at least 3 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters';
        return '';

      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.ng$/i.test(value)) {
          return 'Must be a valid .edu.ng email address';
        }
        return '';

      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^(\+234|0)[789][01]\d{8}$/.test(value.replace(/\s/g, ''))) {
          return 'Enter a valid Nigerian phone number (e.g., 08012345678)';
        }
        return '';

      case 'institution':
        if (!value) return 'Please select your institution';
        return '';

      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Must contain uppercase, lowercase, and number';
        }
        return '';

      case 'agreeToTerms':
        if (!value) return 'You must agree to the terms';
        return '';

      default:
        return '';
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
    setErrors({ ...errors, institution: '' });
    setTouched({ ...touched, institution: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Touch all fields
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    // If no errors, submit
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      alert('Account created successfully! Check your email for verification.');
    }
  };

  const getFieldState = (field) => {
    if (!touched[field]) return 'default';
    return errors[field] ? 'error' : 'success';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card {...props} className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-blue-900">Markeet</span>
          </div>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Join Nigeria's verified student marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            {/* Full Name */}
            <Field>
              <FieldLabel htmlFor="name">Full Name *</FieldLabel>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder="Adebayo Oluwaseun"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  className={
                    getFieldState('fullName') === 'error'
                      ? 'border-red-500 focus-visible:ring-red-200'
                      : getFieldState('fullName') === 'success'
                        ? 'border-green-500 focus-visible:ring-green-200'
                        : ''
                  }
                  required
                />
                {getFieldState('fullName') === 'success' && (
                  <Check className="absolute right-3 top-3 w-5 h-5 text-green-600" />
                )}
                {getFieldState('fullName') === 'error' && (
                  <X className="absolute right-3 top-3 w-5 h-5 text-red-600" />
                )}
              </div>
              {touched.fullName && errors.fullName && (
                <FieldDescription className="text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.fullName}
                </FieldDescription>
              )}
            </Field>

            {/* Email */}
            <Field>
              <FieldLabel htmlFor="email">Student Email *</FieldLabel>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="student@unilag.edu.ng"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value.toLowerCase())}
                  onBlur={() => handleBlur('email')}
                  className={
                    getFieldState('email') === 'error'
                      ? 'border-red-500 focus-visible:ring-red-200'
                      : getFieldState('email') === 'success'
                        ? 'border-green-500 focus-visible:ring-green-200'
                        : ''
                  }
                  required
                />
                {getFieldState('email') === 'success' && (
                  <Check className="absolute right-3 top-3 w-5 h-5 text-green-600" />
                )}
                {getFieldState('email') === 'error' && (
                  <X className="absolute right-3 top-3 w-5 h-5 text-red-600" />
                )}
              </div>
              {touched.email && errors.email ? (
                <FieldDescription className="text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </FieldDescription>
              ) : (
                <FieldDescription className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-green-600" />
                  Only .edu.ng emails accepted
                </FieldDescription>
              )}
            </Field>

            {/* Institution Autocomplete */}
            <Field>
              <FieldLabel htmlFor="institution">Institution *</FieldLabel>
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
                        handleBlur('institution');
                      }, 200);
                    }}
                    onFocus={() => {
                      if (institutionSearch.length > 0) {
                        setShowInstitutionDropdown(true);
                      }
                    }}
                    placeholder="Search university, polytechnic, or college..."
                    className={
                      getFieldState('institution') === 'error'
                        ? 'border-red-500 focus-visible:ring-red-200 pr-10'
                        : getFieldState('institution') === 'success'
                          ? 'border-green-500 focus-visible:ring-green-200 pr-10'
                          : 'pr-10'
                    }
                    required
                  />
                  <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>

                {showInstitutionDropdown && institutionResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {institutionResults.map((school, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectInstitution(school)}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-0 transition"
                      >
                        <div className="font-medium text-gray-900">{school.name}</div>
                        <div className="text-sm text-gray-600">{school.city} • {school.code}</div>
                      </button>
                    ))}
                  </div>
                )}

                {showInstitutionDropdown && institutionSearch.length > 0 && institutionResults.length === 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                    <p className="text-sm text-gray-600">No institutions found. Try a different search.</p>
                  </div>
                )}
              </div>

              {touched.institution && errors.institution ? (
                <FieldDescription className="text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.institution}
                </FieldDescription>
              ) : formData.institution ? (
                <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                  <Check className="w-4 h-4 text-blue-900" />
                  <span className="text-sm text-blue-900 font-medium">
                    {formData.institution.name}
                  </span>
                </div>
              ) : (
                <FieldDescription>
                  Type to search all Nigerian universities, polytechnics, and colleges
                </FieldDescription>
              )}
            </Field>

            {/* Phone Number */}
            <Field>
              <FieldLabel htmlFor="phone">Phone Number *</FieldLabel>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="08012345678"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  className={
                    getFieldState('phone') === 'error'
                      ? 'border-red-500 focus-visible:ring-red-200'
                      : getFieldState('phone') === 'success'
                        ? 'border-green-500 focus-visible:ring-green-200'
                        : ''
                  }
                  required
                />
                {getFieldState('phone') === 'success' && (
                  <Check className="absolute right-3 top-3 w-5 h-5 text-green-600" />
                )}
                {getFieldState('phone') === 'error' && (
                  <X className="absolute right-3 top-3 w-5 h-5 text-red-600" />
                )}
              </div>
              {touched.phone && errors.phone ? (
                <FieldDescription className="text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.phone}
                </FieldDescription>
              ) : (
                <FieldDescription>
                  Nigerian phone number (080, 070, 090 format)
                </FieldDescription>
              )}
            </Field>

            {/* Password with Toggle Visibility */}
            <Field>
              <FieldLabel htmlFor="password">Password *</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={
                    getFieldState('password') === 'error'
                      ? 'border-red-500 focus-visible:ring-red-200 pr-20'
                      : getFieldState('password') === 'success'
                        ? 'border-green-500 focus-visible:ring-green-200 pr-20'
                        : 'pr-20'
                  }
                  required
                />
                <div className="absolute right-3 top-3 flex items-center gap-1">
                  {getFieldState('password') === 'success' && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                  {getFieldState('password') === 'error' && (
                    <X className="w-5 h-5 text-red-600" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 hover:bg-gray-100 rounded transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              {touched.password && errors.password ? (
                <FieldDescription className="text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </FieldDescription>
              ) : (
                <FieldDescription>
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
                  onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
                  onBlur={() => handleBlur('agreeToTerms')}
                  className="mt-1 w-4 h-4 text-blue-900 border-gray-300 rounded focus:ring-blue-900"
                />
                <span className="text-sm text-gray-600">
                  I agree to the Terms of Service and Community Guidelines. I understand this platform is for verified Nigerian students only.
                </span>
              </label>
              {touched.agreeToTerms && errors.agreeToTerms && (
                <FieldDescription className="text-red-600 flex items-center gap-1 ml-7">
                  <AlertCircle className="w-3 h-3" />
                  {errors.agreeToTerms}
                </FieldDescription>
              )}
            </Field>

            {/* Submit Button */}
            <Field>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-blue-900 hover:bg-blue-800"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
              <FieldDescription className="text-center">
                Already have an account?{' '}
                <a href="#" className="text-blue-900 font-semibold hover:underline">
                  Sign in
                </a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}