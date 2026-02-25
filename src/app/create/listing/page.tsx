"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import {
  X,
  AlertCircle,
  ArrowLeft,
  Package,
  ImagePlus,
  Loader,
  Tag,
  Sparkles,
  ThumbsUp,
  Recycle,
} from "lucide-react";

import { Category } from "./types";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useApp } from "@/providers/app-provider";
import { useRouter, useSearchParams } from "next/navigation";
import {
  sendNotificationToAllUsers,
  notifySellerOfMatchingWishes,
} from "@/utils/send-server-notifications";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AnimatePresence, motion } from "motion/react";

// ─── Constants ──────────────────────────────────────────────────────────────

const STEPS = [
  { title: "Basics", subtitle: "What are you listing?", icon: Package },
  {
    title: "Media & Details",
    subtitle: "Photos, price & category",
    icon: ImagePlus,
  },
  { title: "Discovery", subtitle: "Help students find you", icon: Tag },
];

const fetchCategory = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("categories").select("*");
  if (error) return [];
  return data as Category[];
};

// ─── Helper components ───────────────────────────────────────────────────────

const CharCount = ({ current, max }: { current: number; max: number }) => {
  const pct = (current / max) * 100;
  const isNearLimit = pct > 80;
  const isAtLimit = pct > 95;
  return (
    <div className="flex items-center justify-between mt-1.5">
      <div className="flex-1 h-1 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden mr-3">
        <div
          className={`h-full rounded-full transition-all ${
            isAtLimit
              ? "bg-red-500"
              : isNearLimit
                ? "bg-orange-500"
                : "bg-stone-300 dark:bg-stone-700"
          }`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span
        className={`text-xs tabular-nums ${isAtLimit ? "text-red-500" : isNearLimit ? "text-orange-500" : "text-stone-400 dark:text-stone-500"}`}
      >
        {current}/{max}
      </span>
    </div>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
    {children}
  </p>
);

// ─── Main Component ─────────────────────────────────────────────────────────

export default function CreateListing() {
  const { user, supabase } = useApp();
  const searchParams = useSearchParams();
  const offerId = searchParams.get("oid");
  const isEditMode = Boolean(offerId);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [category, setCategory] = useState<Category[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [price, setPrice] = useState<string>("");
  const [condition, setCondition] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ tags?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // ─── Wizard state ───────────────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [stepErrors, setStepErrors] = useState<string[]>([]);

  const totalImages = existingImageUrls.length + images.length;

  useEffect(() => {
    const urls = images.map((img) => URL.createObjectURL(img));
    setPreviewUrls(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  useEffect(() => {
    fetchCategory().then((data) => {
      if (data) setCategory(data);
    });
  }, []);

  // Load existing offer for edit mode
  useEffect(() => {
    if (!offerId || !user) return;
    setIsLoadingExisting(true);
    supabase
      .from("offers")
      .select("*")
      .eq("id", offerId)
      .eq("seller_id", user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          toast.error(
            "Offer not found or you don't have permission to edit it",
          );
          router.push("/");
          return;
        }
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price.toString());
        setSelectedCategory(data.category_id);
        setCondition(data.condition || "");
        setTags(data.tags || []);
        setExistingImageUrls(data.images || []);
        setIsLoadingExisting(false);
      });
  }, [offerId, user, supabase, router]);

  // ─── Validation ─────────────────────────────────────────────────────────

  const validateStep = useCallback(
    (stepNumber: number): boolean => {
      const errs: string[] = [];
      switch (stepNumber) {
        case 1:
          if (!title.trim()) errs.push("Title is required");
          if (!description.trim()) errs.push("Description is required");
          break;
        case 2:
          if (totalImages === 0) errs.push("At least one photo is required");
          if (!selectedCategory) errs.push("Please select a category");
          if (!price || Number(price) <= 0) errs.push("Price is required");
          break;
      }
      setStepErrors(errs);
      return errs.length === 0;
    },
    [title, description, totalImages, selectedCategory, price],
  );

  // ─── Wizard navigation ──────────────────────────────────────────────────

  const handleNext = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    if (validateStep(step)) {
      setStepErrors([]);
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setStepErrors([]);
    setDirection(-1);
    setStep((s) => s - 1);
  };

  // ─── Handlers ───────────────────────────────────────────────────────────

  const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && newTag.trim()) {
      event.preventDefault();
      if (
        tags.some((tag) => tag.toLowerCase() === newTag.trim().toLowerCase())
      ) {
        setErrors({ ...errors, tags: "This tag already exists" });
        return;
      }
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      setErrors({ ...errors, tags: undefined });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const remaining = 5 - totalImages;
      setImages([...images, ...Array.from(files).slice(0, remaining)]);
    }
  };

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();

    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
    if (isMobile && step < STEPS.length) return;

    setIsSubmitting(true);

    try {
      if (!user) {
        toast.error("Please login to continue", { position: "bottom-center" });
        return;
      }

      // Upload new images
      let newImageUrls: string[] = [];
      if (images.length > 0) {
        newImageUrls = await Promise.all(
          images.map(async (image) => {
            const fileExt = image.name.split(".").pop();
            const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const { error } = await supabase.storage
              .from("offer-images")
              .upload(fileName, image);
            if (error) throw error;
            const {
              data: { publicUrl },
            } = supabase.storage.from("offer-images").getPublicUrl(fileName);
            return publicUrl;
          }),
        );
      }

      const listingData = {
        seller_id: user.id,
        title,
        description,
        category_id: selectedCategory,
        offer_type: "product" as const,
        price: Number(price),
        turnaround_days: null,
        condition: condition || null,
        tags,
        images: [...existingImageUrls, ...newImageUrls],
        status: "active" as const,
      };

      let data, error;

      if (isEditMode && offerId) {
        const result = await supabase
          .from("offers")
          .update({ ...listingData, updated_at: new Date().toISOString() })
          .eq("id", offerId)
          .eq("seller_id", user.id)
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else {
        const result = await supabase
          .from("offers")
          .insert(listingData)
          .select()
          .single();
        data = result.data;
        error = result.error;
      }

      if (error) throw error;

      if (!isEditMode) {
        // sendNotificationToAllUsers({
        //   body: `${user.profile.full_name} just listed an item`,
        //   title: `Check out ${listingData.title} on Markeet`,
        //   actionUrl: `/view/listing/${data.id}`,
        // });
      }

      toast.success(
        isEditMode
          ? "Listing updated successfully!"
          : "Listing created successfully!",
        {
          position: "top-center",
        },
      );

      router.push(`/view/listing/${data.id}`);
    } catch (err) {
      console.error(err);
      toast.error(
        `Failed to ${isEditMode ? "update" : "create"} listing. Please try again`,
        {
          position: "top-center",
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Field blocks ────────────────────────────────────────────────────────

  const ConditionToggle = (
    <div>
      <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-3">
        Condition
      </label>
      <div className="grid grid-cols-3 gap-2">
        {[
          { value: "new", label: "New", icon: Sparkles },
          { value: "fairly_used", label: "Fairly used", icon: ThumbsUp },
          { value: "used", label: "Used", icon: Recycle },
        ].map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setCondition(condition === value ? "" : value)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
              condition === value
                ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-sm"
                : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-orange-300 dark:hover:border-orange-700"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${condition === value ? "text-orange-600 dark:text-orange-400" : "text-stone-500 dark:text-stone-400"}`}
            />
            <span
              className={`text-xs font-medium ${condition === value ? "text-orange-700 dark:text-orange-400" : "text-stone-600 dark:text-stone-300"}`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const TitleField = (
    <div>
      <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">
        Product Title <span className="text-red-500">*</span>
      </label>
      <Input
        value={title}
        placeholder="e.g. iPhone 13 Pro - Mint Condition"
        className="py-5 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 text-base text-stone-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-500 placeholder-stone-400 dark:placeholder-stone-500"
        required
        maxLength={100}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <CharCount current={title.length} max={100} />
    </div>
  );

  const DescriptionField = (
    <div>
      <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">
        Description <span className="text-red-500">*</span>
      </label>
      <Textarea
        value={description}
        placeholder="Describe the product condition, features, and meetup details..."
        required
        maxLength={500}
        rows={4}
        className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 focus:border-orange-500 dark:focus:border-orange-500 placeholder-stone-400 dark:placeholder-stone-500 dark:text-white"
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <CharCount current={description.length} max={500} />
    </div>
  );

  const ImageUploadField = (
    <div>
      {totalImages > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-3">
          {existingImageUrls.map((imageUrl, index) => (
            <div
              key={`existing-${index}`}
              className="relative aspect-square rounded-xl border-2 border-stone-200 dark:border-stone-800 overflow-hidden bg-stone-50 dark:bg-stone-900"
            >
              <img
                src={imageUrl}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === 0 && (
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-[10px] font-medium rounded">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() =>
                  setExistingImageUrls(
                    existingImageUrls.filter((_, i) => i !== index),
                  )
                }
                className="absolute top-1.5 right-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {images.map((_, index) => (
            <div
              key={`new-${index}`}
              className="relative aspect-square rounded-xl border-2 border-stone-200 dark:border-stone-800 overflow-hidden bg-stone-50 dark:bg-stone-900"
            >
              <img
                src={previewUrls[index]}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {existingImageUrls.length === 0 && index === 0 && (
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-[10px] font-medium rounded">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => setImages(images.filter((_, i) => i !== index))}
                className="absolute top-1.5 right-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      {totalImages < 5 && (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-xl cursor-pointer bg-white dark:bg-stone-900 hover:bg-stone-50 hover:border-orange-400 dark:hover:border-orange-600 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <ImagePlus className="w-8 h-8 mb-2 text-stone-400 dark:text-stone-500" />
            <p className="text-sm text-stone-600 dark:text-stone-300">
              <span className="font-semibold text-orange-600 dark:text-orange-400">
                Click to upload
              </span>
            </p>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
              PNG, JPG — up to 5 images ({totalImages}/5)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
        </label>
      )}
      <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
        First image becomes the cover photo
      </p>
    </div>
  );

  const CategoryField = (
    <div>
      <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">
        Category <span className="text-red-500">*</span>
      </label>
      <Select
        value={selectedCategory}
        required
        onValueChange={setSelectedCategory}
      >
        <SelectTrigger className="w-full border-2 border-stone-200 dark:border-stone-800 dark:bg-stone-900 dark:text-white focus:border-orange-500">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {category.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                <span className="font-semibold text-stone-900 dark:text-white">
                  {cat.name}
                </span>{" "}
                <span className="text-stone-500 dark:text-stone-400">
                  {cat.description}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );

  const PriceField = (
    <div>
      <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">
        Price (₦) <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 font-medium">
          ₦
        </span>
        <Input
          type="number"
          placeholder="0.00"
          value={price}
          className="pl-8 py-5 border-2 border-stone-200 dark:border-stone-800 dark:bg-stone-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-500"
          required
          min="0"
          step="0.01"
          onChange={(ev) => setPrice(ev.target.value)}
        />
      </div>
    </div>
  );

  const TagsField = (
    <div>
      <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">
        Tags & Keywords
      </label>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-sm font-medium rounded-full border border-orange-200 dark:border-orange-800/40"
            >
              {tag}
              <button
                type="button"
                onClick={() => setTags(tags.filter((t) => t !== tag))}
                className="hover:bg-orange-200 dark:hover:bg-orange-800/40 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
      <Input
        type="text"
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        onKeyDown={handleAddTag}
        placeholder="Type a tag and press Enter"
        className="py-5 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 focus:border-orange-500 dark:focus:border-orange-500 placeholder-stone-400 dark:placeholder-stone-500 dark:text-white"
      />
      {errors.tags && (
        <div className="flex items-center gap-1 mt-2 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="w-3.5 h-3.5" />
          {errors.tags}
        </div>
      )}
      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5">
        Press Enter to add — helps students find your listing
      </p>
    </div>
  );

  const submitLabel = isEditMode ? "Update Listing" : "List Product";

  const SubmitButton = (
    <Button
      type="submit"
      disabled={isSubmitting || isLoadingExisting || totalImages === 0}
      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base py-3 rounded-xl transition-colors disabled:opacity-50 shadow-md"
    >
      {isLoadingExisting ? (
        <>
          <Loader className="w-4 h-4 animate-spin mr-2" />
          Loading...
        </>
      ) : isSubmitting ? (
        <>
          <Loader className="w-4 h-4 animate-spin mr-2" />
          {isEditMode ? "Updating..." : "Creating..."}
        </>
      ) : (
        submitLabel
      )}
    </Button>
  );

  // ─── Mobile step content ─────────────────────────────────────────────────

  const mobileStepContent = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col gap-7">
            {ConditionToggle}
            {TitleField}
            {DescriptionField}
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-7">
            <SectionLabel>
              Photos <span className="text-red-500 normal-case">*</span>
            </SectionLabel>
            {ImageUploadField}
            <SectionLabel>Details</SectionLabel>
            {CategoryField}
            {PriceField}
          </div>
        );
      case 3:
        return <div className="flex flex-col gap-7">{TagsField}</div>;
      default:
        return null;
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Banner */}
      <div className="bg-linear-to-br from-orange-500 via-orange-600 to-orange-700 dark:from-orange-600 dark:via-orange-700 dark:to-orange-800 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full" />
        <div className="relative z-10 px-5 pt-5 pb-6 lg:px-12 lg:pt-8 lg:pb-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-1.5 -ml-1.5 mb-4 rounded-lg hover:bg-white/15 transition"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="hidden lg:flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold">
                {isEditMode ? "Edit Listing" : "Sell a Product"}
              </h1>
              <p className="text-orange-100 text-sm mt-0.5">
                List it and reach students on campus
              </p>
            </div>
          </div>
          <div className="lg:hidden">
            <h1 className="text-xl font-bold">
              {isEditMode ? "Edit Listing" : "Sell a Product"}
            </h1>
            <p className="text-orange-100 text-sm mt-0.5">
              {STEPS[step - 1].subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile progress */}
      <div className="lg:hidden px-5 pt-4 pb-2">
        <div className="flex items-center gap-4">
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
          <span className="text-xs text-stone-500 tabular-nums">
            {step}/{STEPS.length}
          </span>
        </div>
        <div className="mt-4 mb-2">
          <h2 className="text-lg font-bold text-stone-900 dark:text-white">
            {STEPS[step - 1].title}
          </h2>
        </div>
        {stepErrors.length > 0 && (
          <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl">
            {stepErrors.map((err, i) => (
              <p
                key={i}
                className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {err}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-5 lg:px-12 py-6 max-w-2xl">
        {/* Desktop */}
        <div className="hidden lg:flex lg:flex-col gap-7">
          <SectionLabel>Basics</SectionLabel>
          {ConditionToggle}
          {TitleField}
          {DescriptionField}
          <SectionLabel>
            Photos <span className="text-red-500 normal-case">*</span>
          </SectionLabel>
          {ImageUploadField}
          <SectionLabel>Details</SectionLabel>
          {CategoryField}
          {PriceField}
          <SectionLabel>Discovery</SectionLabel>
          {TagsField}
          {SubmitButton}
        </div>

        {/* Mobile wizard */}
        <div className="lg:hidden">
          <div className="relative overflow-hidden">
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
          <div className="pt-6 pb-2 mt-4">
            <Button
              type={step === STEPS.length ? "submit" : "button"}
              onClick={step < STEPS.length ? handleNext : undefined}
              disabled={
                step === STEPS.length &&
                (isSubmitting || isLoadingExisting || totalImages === 0)
              }
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base py-3 rounded-xl transition-colors disabled:opacity-50 shadow-md"
            >
              {step < STEPS.length ? (
                "Continue"
              ) : isLoadingExisting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                submitLabel
              )}
            </Button>
            <p className="text-center text-stone-500 dark:text-stone-400 text-xs mt-4">
              Step {step} of {STEPS.length}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
