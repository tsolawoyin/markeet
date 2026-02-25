"use client";

import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { useApp } from "@/providers/app-provider";
import { Camera, X, AlertCircle, Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { ImageCropperModal } from "./image-cropper-modal";

interface ProfileData {
  name: string;
  avatar: string;
  headline: string;
  bio: string;
  skills: string[];
}

interface FormErrors {
  name?: string;
  avatar?: string;
  headline?: string;
  bio?: string;
  skills?: string;
}

const CharCount = ({
  current,
  max,
}: {
  current: number;
  max: number;
}) => {
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
        className={`text-xs tabular-nums ${
          isAtLimit
            ? "text-red-500"
            : isNearLimit
              ? "text-orange-500"
              : "text-stone-400 dark:text-stone-500"
        }`}
      >
        {current}/{max}
      </span>
    </div>
  );
};

export function ProfileSection() {
  const { user, setUser, supabase } = useApp();

  const [profile, setProfile] = useState<ProfileData>({
    name: user?.profile.full_name || "",
    avatar: user?.profile.avatar_url || "",
    headline: user?.about?.headline || "",
    bio: user?.about?.bio || "",
    skills: user?.about?.skills || [],
  });

  const [formData, setFormData] = useState<ProfileData>({ ...profile });
  const [newSkill, setNewSkill] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_BIO_LENGTH = 500;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleInputChange = (
    field: keyof ProfileData,
    value: string | string[],
  ) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    // Reset so the same file can be re-selected
    event.target.value = "";

    if (file.size > MAX_FILE_SIZE) {
      setErrors({ ...errors, avatar: "File size must be less than 5MB" });
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, avatar: "Please select an image file" });
      return;
    }

    // Read the file and open the cropper
    const reader = new FileReader();
    reader.onloadend = () => {
      setCropSrc(reader.result as string);
      setErrors({ ...errors, avatar: undefined });
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (blob: Blob) => {
    const file = new File([blob], `avatar-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(blob));
    setCropSrc(null);
  };

  const handleAddSkill = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && newSkill.trim()) {
      event.preventDefault();

      if (formData.skills.length >= 10) {
        setErrors({ ...errors, skills: "Maximum 10 skills allowed" });
        return;
      }

      if (
        formData.skills?.some(
          (skill) => skill.toLowerCase() === newSkill.trim().toLowerCase(),
        )
      ) {
        setErrors({ ...errors, skills: "This skill already exists" });
        return;
      }

      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill("");
      setErrors({ ...errors, skills: undefined });
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.headline.trim()) newErrors.headline = "Headline is required";
    if (!formData.bio.trim()) newErrors.bio = "Bio is required";
    if (formData.skills.length === 0)
      newErrors.skills = "Add at least one skill";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = (): void => {
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSave = async (): Promise<void> => {
    setIsSaving(true);
    setShowConfirmModal(false);

    try {
      if (!user) throw new Error("Please refresh");

      let avatarUrl = formData.avatar;

      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatarUrl = data.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.name,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      const { data: existingAbout, error: checkError } = await supabase
        .from("about")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingAbout) {
        const { error: aboutError } = await supabase
          .from("about")
          .update({
            headline: formData.headline,
            bio: formData.bio,
            skills: formData.skills,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);

        if (aboutError) throw aboutError;
      } else {
        const { error: aboutError } = await supabase.from("about").insert({
          user_id: user.id,
          headline: formData.headline,
          bio: formData.bio,
          skills: formData.skills,
        });

        if (aboutError) throw aboutError;
      }

      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.name,
          avatar_url: avatarUrl,
        },
      });

      if (authError) throw authError;

      const updatedProfile: ProfileData = {
        ...formData,
        avatar: avatarUrl,
      };

      setProfile(updatedProfile);
      setFormData(updatedProfile);
      setAvatarFile(null);
      setAvatarPreview(null);

      // Update Shell context so the rest of the app reflects the changes
      setUser({
        ...user,
        profile: {
          ...user.profile,
          full_name: formData.name,
          avatar_url: avatarUrl,
        },
        about: {
          ...user.about,
          headline: formData.headline,
          bio: formData.bio,
          skills: formData.skills,
        },
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = (): void => {
    setFormData({ ...profile });
    setAvatarFile(null);
    setAvatarPreview(null);
    setNewSkill("");
    setErrors({});
  };

  const hasChanges = (): boolean => {
    return (
      formData.name !== profile.name ||
      formData.headline !== profile.headline ||
      formData.bio !== profile.bio ||
      JSON.stringify(formData.skills) !== JSON.stringify(profile.skills) ||
      avatarPreview !== null
    );
  };

  const inputClassName =
    "py-5 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 text-base text-stone-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-500 placeholder-stone-400 dark:placeholder-stone-500";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-stone-900 dark:text-white">
          Profile
        </h2>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={
              avatarPreview ||
              formData.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || "user")}&background=f97316&color=fff&size=200&bold=true&rounded=true`
            }
            alt="Profile"
            className="w-20 h-20 rounded-full bg-white dark:bg-stone-900 shadow-md object-cover border-2 border-stone-200 dark:border-stone-800"
          />
          <button
            type="button"
            onClick={handleAvatarClick}
            className="absolute -bottom-2 -right-2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-1">
            {avatarFile ? avatarFile.name : "Tap camera to upload"}
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-500">
            JPG, PNG or GIF. Max 5MB
          </p>
          {errors.avatar && (
            <div className="flex items-center gap-1 mt-2 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.avatar}
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter your name"
          className={inputClassName}
        />
        {errors.name && (
          <div className="flex items-center gap-1 mt-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.name}
          </div>
        )}
      </div>

      {/* Headline */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">
          Headline <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={formData.headline}
          onChange={(e) => handleInputChange("headline", e.target.value)}
          placeholder="e.g., Professional Hair Stylist & Braiding Expert"
          className={inputClassName}
        />
        {errors.headline && (
          <div className="flex items-center gap-1 mt-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.headline}
          </div>
        )}
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">
          Bio <span className="text-red-500">*</span>
        </label>
        <Textarea
          value={formData.bio}
          onChange={(e) => handleInputChange("bio", e.target.value)}
          placeholder="Tell people about yourself and your services..."
          maxLength={MAX_BIO_LENGTH}
          rows={4}
          className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 focus:border-orange-500 dark:focus:border-orange-500 placeholder-stone-400 dark:placeholder-stone-500 dark:text-white"
        />
        <CharCount current={formData.bio.length} max={MAX_BIO_LENGTH} />
        {errors.bio && (
          <div className="flex items-center gap-1 mt-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.bio}
          </div>
        )}
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-2">
          Skills & Services <span className="text-red-500">*</span>
        </label>
        {formData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-sm font-medium rounded-full border border-orange-200 dark:border-orange-800/40"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
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
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleAddSkill}
          placeholder="Type a skill and press Enter"
          className={inputClassName}
        />
        {errors.skills && (
          <div className="flex items-center gap-1 mt-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.skills}
          </div>
        )}
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5">
          Press Enter to add — up to 10 skills
        </p>
      </div>

      {/* Save / Cancel */}
      {hasChanges() && (
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            onClick={handleCancel}
            variant="secondary"
            className="dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSaveClick}
            disabled={isSaving}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-md"
          >
            {isSaving ? (
              <>
                <Loader className="w-4 h-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      )}

      {/* Confirm Dialog */}
      <AlertDialog open={showConfirmModal}>
        <AlertDialogContent className="dark:bg-stone-900 dark:border-stone-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">
              Save Changes?
            </AlertDialogTitle>
            <AlertDialogDescription className="dark:text-stone-400">
              Are you sure you want to update your profile? This will be visible
              to all users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setShowConfirmModal(false)}
              disabled={isSaving}
              className="dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSave}
              disabled={isSaving}
              className="bg-orange-500 dark:bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isSaving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Yes, Save"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Image Cropper Modal */}
      <ImageCropperModal
        imageSrc={cropSrc}
        open={cropSrc !== null}
        onOpenChange={(open) => {
          if (!open) setCropSrc(null);
        }}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
