"use client";

import { useState, useContext, useEffect } from "react";
import {
  ArrowLeft,
  Camera,
  Shield,
  X,
  Loader,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ShellContext } from "@/shell/shell";
import Link from "next/link";

const categories = [
  { id: "textbooks", name: "Textbooks" },
  { id: "phones & laptops", name: "Phones & Laptops" },
  { id: "hostel essentials", name: "Hostel Essentials" },
];

const conditions = [
  { id: "new", name: "Brand New" },
  { id: "fairly-used", name: "Fairly Used" },
  { id: "used", name: "Used" },
];

export default function CreateListingPage() {
  const { supabase, user } = useContext(ShellContext);
  const [userProfile, setUserProfile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch user profile on mount
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setErrorMessage("Could not load your profile. Please try again.");
      setShowErrorDialog(true);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 8 images total
    const remainingSlots = 8 - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      setErrorMessage(
        `You can only upload ${remainingSlots} more image(s). Maximum is 8 images.`
      );
      setShowErrorDialog(true);
      return;
    }

    // Validate file sizes (5MB each)
    const oversizedFiles = filesToAdd.filter((file) => file.size > 5242880);
    if (oversizedFiles.length > 0) {
      setErrorMessage("Each image must be less than 5MB");
      setShowErrorDialog(true);
      return;
    }

    // Add files to state
    setImages((prev) => [...prev, ...filesToAdd]);

    // Create previews
    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (listingId) => {
    const uploadedUrls = [];

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${i}.${fileExt}`;
      const filePath = `${user.id}/${listingId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("listing-images")
        .upload(filePath, file);

      if (error) {
        console.error("Error uploading image:", error);
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("listing-images")
        .getPublicUrl(filePath);

      uploadedUrls.push(urlData.publicUrl);
      setUploadProgress(((i + 1) / images.length) * 100);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if profile is loaded
    if (!userProfile) {
      setErrorMessage("Profile not loaded. Please refresh and try again.");
      setShowErrorDialog(true);
      return;
    }

    // Validation
    if (images.length === 0) {
      setErrorMessage("Please add at least one image of your item");
      setShowErrorDialog(true);
      return;
    }

    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.category ||
      !formData.condition
    ) {
      setErrorMessage("Please fill in all required fields");
      setShowErrorDialog(true);
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Create listing first to get ID
      const listingData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        condition: formData.condition,
        hall_of_residence: userProfile.hall_of_residence,
        seller_id: user.id,
        seller_email: userProfile.email,
        seller_name: userProfile.full_name,
        seller_phone: userProfile.phone,
        status: "active",
        images: [], // Will update after upload
      };

      const { data: listing, error: listingError } = await supabase
        .from("listings")
        .insert([listingData])
        .select()
        .single();

      if (listingError) throw listingError;

      // Upload images
      const imageUrls = await uploadImages(listing.id);

      // Update listing with image URLs
      const { error: updateError } = await supabase
        .from("listings")
        .update({ images: imageUrls })
        .eq("id", listing.id);

      if (updateError) throw updateError;

      // Success!
      setShowSuccessDialog(true);

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
        condition: "",
      });
      setImages([]);
      setImagePreviews([]);
      setUploadProgress(0);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error creating listing:", error);
      setErrorMessage(
        error.message || "Something went wrong. Please try again"
      );
      setShowErrorDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      {/* Header */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Create Listing
            </span>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish"
            )}
          </Button>
        </div>
      </nav>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-6 border border-gray-200 dark:border-gray-700"
        >
          {/* User Info Display */}
          {userProfile && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Posting as:
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {userProfile.full_name} • {userProfile.hall_of_residence}
              </p>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block font-semibold mb-3 text-gray-900 dark:text-white">
              Photos (Required) - {images.length}/8
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Upload Button */}
              {images.length < 8 && (
                <label className="aspect-square border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg flex flex-col items-center justify-center hover:border-blue-900 dark:hover:border-blue-400 cursor-pointer bg-blue-50 dark:bg-blue-900/20 transition">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <Camera className="w-8 h-8 text-blue-900 dark:text-blue-400 mb-2" />
                  <span className="text-sm text-blue-900 dark:text-blue-400 font-medium">
                    Add Photo
                  </span>
                </label>
              )}

              {/* Image Previews */}
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="aspect-square relative rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-blue-900 dark:bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Cover
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Add up to 8 photos (max 5MB each). First photo will be the cover
              image.
            </p>

            {/* Upload Progress */}
            {isSubmitting && uploadProgress > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Uploading images...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-900 dark:bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold mb-2 text-gray-900 dark:text-white">
              Title *
            </label>
            <Input
              type="text"
              placeholder="e.g., Engineering Mathematics Textbook"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-2 text-gray-900 dark:text-white">
              Description *
            </label>
            <textarea
              rows={5}
              placeholder="Describe your item: condition, why you're selling, included items, etc."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold mb-2 text-gray-900 dark:text-white">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={isSubmitting}
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block font-semibold mb-2 text-gray-900 dark:text-white">
              Price (₦) *
            </label>
            <Input
              type="number"
              placeholder="18000"
              min="0"
              step="100"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
              disabled={isSubmitting}
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Set a fair price. Be honest about the condition.
            </p>
          </div>

          {/* Condition */}
          <div>
            <label className="block font-semibold mb-2 text-gray-900 dark:text-white">
              Condition *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {conditions.map((cond) => (
                <button
                  type="button"
                  key={cond.id}
                  onClick={() =>
                    setFormData({ ...formData, condition: cond.id })
                  }
                  disabled={isSubmitting}
                  className={`px-4 py-3 border-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
                    formData.condition === cond.id
                      ? "border-blue-900 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-400"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-900 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {cond.name}
                </button>
              ))}
            </div>
          </div>

          {/* Safety Notice */}
          <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Shield className="w-5 h-5 text-blue-900 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Safety Tips
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                Meet buyers in public campus locations (UI Library, SUB, Faculty
                entrances). Never share sensitive personal information in
                listings.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Creating Listing...
                </>
              ) : (
                "Publish Listing"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-center text-xl dark:text-white">
              Listing Created Successfully! 🎉
            </DialogTitle>
            <DialogDescription className="text-center dark:text-gray-400">
              Your item is now live and visible to students at University of
              Ibadan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
            >
              Create Another Listing
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessDialog(false);
                window.location.href = "/browse";
              }}
              className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Browse Listings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <X className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-center text-xl dark:text-white">
              Oops! Something went wrong
            </DialogTitle>
            <DialogDescription className="text-center dark:text-gray-400">
              {errorMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowErrorDialog(false)}
              className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
