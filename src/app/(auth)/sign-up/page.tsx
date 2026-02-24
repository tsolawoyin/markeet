"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Shield,
  Check,
  X,
  Loader,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Users,
  UserRound,
  GraduationCap,
  Lock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import { useApp } from "@/providers/app-provider";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { type Profile } from "@/providers/app-provider";
import { debug } from "@/utils/debug";

const STEPS = [
  { title: "About You", subtitle: "Let's get to know you", icon: UserRound },
  { title: "University Details", subtitle: "Verify your campus identity", icon: GraduationCap },
  { title: "Secure Your Account", subtitle: "Set up your password", icon: Lock },
];

const STEP_FIELDS: string[][] = [
  ["fullName", "email"],
  ["phone", "hallOfResidence", "course"],
  ["password", "agreeToTerms"],
];

const hallsOfResidence = [
  { value: "queen-elizabeth", label: "Queen Elizabeth II Hall" },
  { value: "queen-idia", label: "Queen Idia Hall" },
  { value: "obafemi-awolowo", label: "Awo Hall" },
  { value: "mellanby", label: "Mellanby Hall" },
  { value: "tedder", label: "Tedder Hall" },
  { value: "kuti", label: "Kuti Hall" },
  { value: "sultan-bello", label: "Sultan Bello Hall" },
  { value: "independence", label: "Great Independence Hall" },
  { value: "nnamdi-azikiwe", label: "Nnamdi Azikiwe Hall" },
  { value: "alexander-brown-hall", label: "Alexander Brown Hall (ABH)" },
  { value: "off-campus", label: "Off Campus" },
];

export default function SignupForm() {
  const { supabase } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const referrerId = searchParams.get("ref");

  const [referrer, setReferrer] = useState<Profile | null>(null);

  // Fetch referrer profile when ref param exists
  useEffect(() => {
    if (!referrerId) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", referrerId)
      .single()
      .then(({ data }) => {
        if (data) setReferrer(data);
      });
  }, [referrerId]);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    hallOfResidence: "",
    course: "",
    password: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  // Validation rules
  const validateField = (name: string, value: string | boolean): string => {
    switch (name) {
      case "fullName":
        if (!String(value).trim()) return "Full name is required";
        if (String(value).trim().length < 3)
          return "Name must be at least 3 characters";
        if (!/^[a-zA-Z\s]+$/.test(String(value)))
          return "Name can only contain letters";
        return "";

      case "email":
        if (!String(value).trim()) return "Email is required";
        if (
          !/^[a-zA-Z0-9._%+-]+@(stu|dlc)\.ui\.edu\.ng$/i.test(String(value))
        ) {
          return "Must be a valid @stu.ui.edu.ng or @dlc.ui.edu.ng email";
        }
        return "";

      case "phone":
        if (!String(value).trim()) return "Phone number is required";
        if (
          !/^(\+234|0)[789][01]\d{8}$/.test(String(value).replace(/\s/g, ""))
        ) {
          return "Enter a valid Nigerian phone number";
        }
        return "";

      case "hallOfResidence":
        if (!value) return "Please select your hall of residence";
        return "";

      case "course":
        if (!String(value).trim()) return "Course of study is required";
        if (String(value).trim().length < 2)
          return "Course name must be at least 2 characters";
        return "";

      case "password":
        if (!value) return "Password is required";
        if (String(value).length < 8)
          return "Password must be at least 8 characters";
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(String(value))) {
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

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    const fieldError = validateField(
      field,
      formData[field as keyof typeof formData]
    );
    setErrors({ ...errors, [field]: fieldError });
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      const fieldError = validateField(field, value);
      setErrors({ ...errors, [field]: fieldError });
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    const fields = STEP_FIELDS[stepNumber - 1];
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};

    fields.forEach((field) => {
      newTouched[field] = true;
      const fieldError = validateField(
        field,
        formData[field as keyof typeof formData]
      );
      if (fieldError) newErrors[field] = fieldError;
    });

    setTouched({ ...touched, ...newTouched });
    setErrors({ ...errors, ...newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(step - 1);
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
    const newErrors: Record<string, string> = {};

    Object.keys(formData).forEach((key) => {
      const fieldError = validateField(
        key,
        formData[key as keyof typeof formData]
      );
      if (fieldError) newErrors[key] = fieldError;
    });

    setErrors(newErrors);

    // If no errors, submit
    if (Object.keys(newErrors).length === 0) {
      try {
        const { data, error: signupError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            // emailRedirectTo: `${window.location.origin}/email-confirmed`,
            data: {
              full_name: formData.fullName,
              phone: formData.phone,
              hall_of_residence: formData.hallOfResidence,
              course: formData.course,
              institution: "University of Ibadan",
              ...(referrerId ? { referrer_id: referrerId } : {}),
            },
          },
        });

        if (signupError) throw signupError;
        if (!data.user) throw new Error("Failed to create account");

        const params = new URLSearchParams({ email: formData.email });
        if (referrerId) params.set("ref", referrerId);
        router.push(`/sign-up-success?${params.toString()}`);
      } catch (err: any) {
        debug.error("Signup error:", err);
        setError(err.message);
      }
    }
  };

  const onSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    startTransition(handleSubmit);
  };

  const getFieldState = (field: string) => {
    if (!touched[field]) return "default";
    return errors[field] ? "error" : "success";
  };

  const getInputClassName = (field: string) => {
    const state = getFieldState(field);
    const base =
      "text-sm dark:bg-stone-800 dark:text-white dark:placeholder-stone-400";
    if (state === "error") {
      return `${base} border-red-500 focus-visible:ring-red-200 dark:border-red-400`;
    }
    if (state === "success") {
      return `${base} border-green-500 focus-visible:ring-green-200 dark:border-green-400`;
    }
    return `${base} dark:border-stone-700`;
  };

  // ─── Field Components ───────────────────────────────────────────────

  const FullNameField = (prefix: string) => (
    <Field>
      <FieldLabel htmlFor={`${prefix}-name`} className="dark:text-stone-200 text-sm">
        Full Name
      </FieldLabel>
      <div className="relative">
        <Input
          id={`${prefix}-name`}
          type="text"
          placeholder="Phenomenal"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          onBlur={() => handleBlur("fullName")}
          className={getInputClassName("fullName")}
        />
        {getFieldState("fullName") === "success" && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
        )}
        {getFieldState("fullName") === "error" && (
          <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
        )}
      </div>
      {touched.fullName && errors.fullName && (
        <FieldDescription className="text-red-600 flex items-center gap-1 text-xs">
          <AlertCircle className="w-3 h-3" />
          {errors.fullName}
        </FieldDescription>
      )}
    </Field>
  );

  const EmailField = (prefix: string) => (
    <Field>
      <FieldLabel htmlFor={`${prefix}-email`} className="dark:text-stone-200 text-sm">
        Student Email
      </FieldLabel>
      <div className="relative">
        <Input
          id={`${prefix}-email`}
          type="email"
          placeholder="student@stu.ui.edu.ng"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value.toLowerCase())}
          onBlur={() => handleBlur("email")}
          className={getInputClassName("email")}
        />
        {getFieldState("email") === "success" && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
        )}
        {getFieldState("email") === "error" && (
          <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
        )}
      </div>
      {touched.email && errors.email ? (
        <FieldDescription className="text-red-600 flex items-center gap-1 text-xs">
          <AlertCircle className="w-3 h-3" />
          {errors.email}
        </FieldDescription>
      ) : (
        <FieldDescription className="flex items-center gap-1 dark:text-stone-400 text-xs">
          <Shield className="w-3 h-3 text-green-600" />
          Only @stu.ui.edu.ng emails accepted
        </FieldDescription>
      )}
    </Field>
  );

  const PhoneField = (prefix: string) => (
    <Field>
      <FieldLabel htmlFor={`${prefix}-phone`} className="dark:text-stone-200 text-sm">
        Phone Number
      </FieldLabel>
      <div className="relative">
        <Input
          id={`${prefix}-phone`}
          type="tel"
          placeholder="08012345678"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          onBlur={() => handleBlur("phone")}
          className={getInputClassName("phone")}
        />
        {getFieldState("phone") === "success" && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
        )}
        {getFieldState("phone") === "error" && (
          <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
        )}
      </div>
      {touched.phone && errors.phone ? (
        <FieldDescription className="text-red-600 flex items-center gap-1 text-xs">
          <AlertCircle className="w-3 h-3" />
          {errors.phone}
        </FieldDescription>
      ) : (
        <FieldDescription className="dark:text-stone-400 text-xs">
          Nigerian phone number (080, 070, 090)
        </FieldDescription>
      )}
    </Field>
  );

  const HallField = (prefix: string) => (
    <Field>
      <FieldLabel
        htmlFor={`${prefix}-hallOfResidence`}
        className="dark:text-stone-200 text-sm"
      >
        Hall of Residence
      </FieldLabel>
      <Select
        value={formData.hallOfResidence}
        onValueChange={(value) => {
          handleChange("hallOfResidence", value);
          setTouched({ ...touched, hallOfResidence: true });
        }}
      >
        <SelectTrigger
          className={`text-sm ${
            getFieldState("hallOfResidence") === "error"
              ? "border-red-500 dark:border-red-400"
              : getFieldState("hallOfResidence") === "success"
                ? "border-green-500 dark:border-green-400"
                : "dark:bg-stone-800 dark:border-stone-700"
          }`}
        >
          <SelectValue placeholder="Select your hall" />
        </SelectTrigger>
        <SelectContent>
          {hallsOfResidence.map((hall) => (
            <SelectItem key={hall.value} value={hall.value}>
              {hall.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {touched.hallOfResidence && errors.hallOfResidence && (
        <FieldDescription className="text-red-600 flex items-center gap-1 text-xs">
          <AlertCircle className="w-3 h-3" />
          {errors.hallOfResidence}
        </FieldDescription>
      )}
    </Field>
  );

  const CourseField = (prefix: string) => (
    <Field>
      <FieldLabel htmlFor={`${prefix}-course`} className="dark:text-stone-200 text-sm">
        Course of Study
      </FieldLabel>
      <div className="relative">
        <Input
          id={`${prefix}-course`}
          type="text"
          placeholder="e.g., Computer Science"
          value={formData.course}
          onChange={(e) => handleChange("course", e.target.value)}
          onBlur={() => handleBlur("course")}
          className={getInputClassName("course")}
        />
        {getFieldState("course") === "success" && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
        )}
        {getFieldState("course") === "error" && (
          <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
        )}
      </div>
      {touched.course && errors.course && (
        <FieldDescription className="text-red-600 flex items-center gap-1 text-xs">
          <AlertCircle className="w-3 h-3" />
          {errors.course}
        </FieldDescription>
      )}
    </Field>
  );

  const PasswordField = (prefix: string) => (
    <Field>
      <FieldLabel htmlFor={`${prefix}-password`} className="dark:text-stone-200 text-sm">
        Password
      </FieldLabel>
      <div className="relative">
        <Input
          id={`${prefix}-password`}
          name={`${prefix}-password`}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          onBlur={() => handleBlur("password")}
          className={`pr-20 ${getInputClassName("password")}`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {getFieldState("password") === "success" && (
            <Check className="w-4 h-4 text-green-600" />
          )}
          {getFieldState("password") === "error" && (
            <X className="w-4 h-4 text-red-600" />
          )}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-1 hover:bg-stone-100 dark:hover:bg-stone-700 rounded transition"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-stone-500" />
            ) : (
              <Eye className="w-4 h-4 text-stone-500" />
            )}
          </button>
        </div>
      </div>
      {touched.password && errors.password ? (
        <FieldDescription className="text-red-600 flex items-center gap-1 text-xs">
          <AlertCircle className="w-3 h-3" />
          {errors.password}
        </FieldDescription>
      ) : (
        <FieldDescription className="dark:text-stone-400 text-xs">
          Min. 8 characters with uppercase, lowercase, and number
        </FieldDescription>
      )}
    </Field>
  );

  const TermsField = (
    <Field>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="terms"
          checked={formData.agreeToTerms}
          onChange={(e) => handleChange("agreeToTerms", e.target.checked)}
          onBlur={() => handleBlur("agreeToTerms")}
          className="mt-1 w-4 h-4 text-orange-500 border-stone-300 rounded focus:ring-orange-500"
        />
        <span className="text-xs text-stone-600 dark:text-stone-400">
          I agree to the Terms of Service and Community Guidelines. I understand
          this platform is for verified University of Ibadan students only.
        </span>
      </label>
      {touched.agreeToTerms && errors.agreeToTerms && (
        <FieldDescription className="text-red-600 flex items-center gap-1 ml-7 text-xs">
          <AlertCircle className="w-3 h-3" />
          {errors.agreeToTerms}
        </FieldDescription>
      )}
    </Field>
  );

  const ErrorAlert = error && (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Signup Failed</AlertTitle>
      <AlertDescription className="text-xs">{error}</AlertDescription>
    </Alert>
  );

  const SubmitButton = (
    <Button
      type="submit"
      disabled={isPending}
      className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm py-2.5"
    >
      {isPending ? (
        <>
          <Loader className="w-4 h-4 animate-spin mr-2" />
          Creating Account...
        </>
      ) : (
        "Create Account"
      )}
    </Button>
  );

  // ─── Mobile Step Content ────────────────────────────────────────────

  const mobileStepContent = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return (
          <FieldGroup>
            {FullNameField("mobile")}
            {EmailField("mobile")}
          </FieldGroup>
        );
      case 2:
        return (
          <FieldGroup>
            {PhoneField("mobile")}
            {HallField("mobile")}
            {CourseField("mobile")}
          </FieldGroup>
        );
      case 3:
        return (
          <FieldGroup>
            {PasswordField("mobile")}
            {TermsField}
            {ErrorAlert}
          </FieldGroup>
        );
      default:
        return null;
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────

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
            The trusted marketplace
            <br />
            for UI students.
          </h2>
          <p className="text-orange-100 max-w-sm">
            Buy, sell, and trade with verified students on campus.
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
      <div className="flex flex-col min-h-screen lg:min-h-0 bg-stone-50 dark:bg-stone-950 lg:overflow-y-auto">
        {/* ─── Mobile Header: Branding + Progress + Step Info ──────── */}
        <div className="lg:hidden">
          {/* Brand hero — only on step 1 */}
          <AnimatePresence>
            {step === 1 && (
              <motion.div
                initial={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="bg-linear-to-br from-orange-500 via-orange-600 to-orange-700 dark:from-orange-600 dark:via-orange-700 dark:to-orange-800 px-6 pt-10 pb-8 text-white relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full" />
                  <div className="relative z-10">
                    <h1 className="text-2xl font-bold">
                      Join Markeet
                    </h1>
                    <p className="text-orange-100 text-sm mt-1 max-w-65">
                      The trusted marketplace for UI students. Buy, sell, and trade on campus.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Referral invitation banner (mobile) */}
          {referrer && (
            <div className="mx-5 mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <img
                  src={
                    referrer.avatar_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(referrer.full_name)}&background=f97316&color=fff&size=80&bold=true&rounded=true`
                  }
                  alt={referrer.full_name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-amber-300 dark:border-amber-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                      You&apos;ve been invited!
                    </span>
                  </div>
                  <p className="text-sm text-amber-900 dark:text-amber-200">
                    <span className="font-bold">{referrer.full_name}</span> is
                    inviting you to join Markeet — the marketplace built for UI
                    students. Buy, sell, and connect with fellow students on a
                    platform you can trust.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Progress bar + back button */}
          <div className="px-5 pt-5 pb-2">
            <div className="flex items-center gap-4 mb-5">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="p-1.5 -ml-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-900 transition"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5 text-stone-700 dark:text-stone-300" />
                </button>
              ) : (
                <div className="w-8" />
              )}
              <div className="flex-1">
                <div className="flex gap-2">
                  {STEPS.map((_, i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full overflow-hidden bg-stone-200 dark:bg-stone-800"
                    >
                      <motion.div
                        className="h-full bg-orange-500 rounded-full"
                        initial={{ width: i + 1 <= step ? "100%" : "0%" }}
                        animate={{ width: i + 1 <= step ? "100%" : "0%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <span className="text-xs text-stone-500 dark:text-stone-500 tabular-nums">
                {step}/{STEPS.length}
              </span>
            </div>

            {/* Step title with icon */}
            <div className="flex items-center gap-3 mb-2">
              {/* {(() => {
                const StepIcon = STEPS[step - 1].icon;
                return (
                  <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <StepIcon className="w-4.5 h-4.5 text-orange-600 dark:text-orange-400" />
                  </div>
                );
              })()} */}
              <div>
                <h1 className="text-xl font-bold text-stone-900 dark:text-white">
                  {STEPS[step - 1].title}
                </h1>
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                  {STEPS[step - 1].subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Desktop Header (hidden on mobile) ───────────────────── */}
        <div className="hidden lg:block px-12 pt-10">
          <div className="max-w-lg">
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-1">
              Create your account
            </p>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
              Join <span className="text-orange-500">Markeet</span>
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Start buying and selling on campus today
            </p>

            {/* Referral invitation banner (desktop) */}
            {referrer && (
              <div className="mt-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <img
                    src={
                      referrer.avatar_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(referrer.full_name)}&background=f97316&color=fff&size=80&bold=true&rounded=true`
                    }
                    alt={referrer.full_name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-amber-300 dark:border-amber-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                        You&apos;ve been invited!
                      </span>
                    </div>
                    <p className="text-sm text-amber-900 dark:text-amber-200">
                      <span className="font-bold">{referrer.full_name}</span> is
                      inviting you to join Markeet — the marketplace built for UI
                      students. Buy, sell, and connect with fellow students on a
                      platform you can trust.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Form ────────────────────────────────────────────────── */}
        <form
          onSubmit={onSubmit}
          noValidate
          className="flex-1 flex flex-col lg:flex-none px-5 lg:px-12 pt-6 lg:pt-8 pb-4"
        >
          {/* Desktop: all fields at once */}
          <div className="hidden lg:block max-w-lg">
            <FieldGroup>
              {/* Personal Info */}
              <p className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                Personal Info
              </p>
              {FullNameField("desktop")}
              {EmailField("desktop")}
              {PhoneField("desktop")}

              {/* University Details */}
              <p className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider mt-2">
                University Details
              </p>
              <div className="grid grid-cols-2 gap-4">
                {HallField("desktop")}
                {CourseField("desktop")}
              </div>

              {/* Account Security */}
              <p className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider mt-2">
                Account Security
              </p>
              {PasswordField("desktop")}
              {TermsField}

              {ErrorAlert}

              <Field>{SubmitButton}</Field>
            </FieldGroup>

            <p className="text-center text-stone-600 dark:text-stone-400 text-sm mt-6 pb-10">
              Already have an account?{" "}
              <Link
                href={referrerId ? `/login?ref=${referrerId}` : "/login"}
                className="text-orange-500 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Mobile: step-by-step wizard */}
          <div className="lg:hidden flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                initial={{ x: direction * 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction * -80, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {mobileStepContent(step)}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile: sticky bottom actions */}
          <div className="lg:hidden pt-4 pb-2 mt-auto">
            {step < STEPS.length ? (
              <Button
                type="button"
                onClick={handleNext}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm py-2.5"
              >
                Continue
              </Button>
            ) : (
              SubmitButton
            )}
            <p className="text-center text-stone-500 dark:text-stone-400 text-xs mt-4">
              {step === 1 ? (
                <>
                  Already have an account?{" "}
                  <Link
                    href={referrerId ? `/login?ref=${referrerId}` : "/login"}
                    className="text-orange-500 font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </>
              ) : (
                <>Step {step} of {STEPS.length}</>
              )}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
