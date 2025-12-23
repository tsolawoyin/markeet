// ============================================
// FILE: app/listing/create/listing-form-client.tsx
// ============================================

"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Shield,
  X,
  Loader,
  CheckCircle2,
  ArrowLeft,
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
import Header from "@/components/header/header";
import { ShellContext } from "@/shell/shell";

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

export default function ListingFormClient({
  listingId,
}: {
  listingId?: string;
}) {
  const router = useRouter();
  const { supabase, user } = useContext(ShellContext);
  const userId = user?.id;
  const isEditing = !!listingId;

  const [userProfile, setUserProfile] = useState<any>(null);
  const [existingListing, setExistingListing] = useState<any>(null);
  const [loading, setLoading] = useState(isEditing);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    status: "active",
  });

  const [images, setImages] = useState<any[]>([]);
  const [imagePreviews, setImagePreviews] = useState<any[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch data on mount
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, listingId]);

  const fetchData = async () => {
    try {
      console.log("run");
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;
      setUserProfile(profile);

      console.log("not run");

      // If editing, fetch existing listing
      if (isEditing && listingId) {
        const { data: listing, error: listingError } = await supabase
          .from("listings")
          .select("*")
          .eq("id", listingId)
          .eq("seller_id", userId) // Ensure user owns the listing
          .single();

        if (listingError) throw listingError;

        // Populate form with existing data
        setFormData({
          title: listing.title,
          description: listing.description,
          price: listing.price.toString(),
          category: listing.category,
          condition: listing.condition,
          status: listing.status,
        });

        // Set existing images
        if (listing.images && listing.images.length > 0) {
          setExistingImages(listing.images);
          setImagePreviews(listing.images);
        }

        setExistingListing(listing);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Could not load data. Please try again.");
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: any) => {
    const files = Array.from(e.target.files);

    // Calculate total images (existing + new)
    const totalImages = existingImages.length + images.length;
    const remainingSlots = 8 - totalImages;
    const filesToAdd = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      setErrorMessage(
        `You can only upload ${remainingSlots} more image(s). Maximum is 8 images.`
      );
      setShowErrorDialog(true);
      return;
    }

    // Validate file sizes (5MB each)
    const oversizedFiles = filesToAdd.filter(
      (file: any) => file.size > 5242880
    );
    if (oversizedFiles.length > 0) {
      setErrorMessage("Each image must be less than 5MB");
      setShowErrorDialog(true);
      return;
    }

    // Add files to state
    setImages((prev) => [...prev, ...filesToAdd]);

    // Create previews
    filesToAdd.forEach((file: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: any) => {
    // Check if it's an existing image or new upload
    if (index < existingImages.length) {
      // Remove from existing images
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Remove from new images
      const newImageIndex = index - existingImages.length;
      setImages((prev) => prev.filter((_, i) => i !== newImageIndex));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const uploadImages = async (listingIdForUpload: any) => {
    const uploadedUrls = [];

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${i}.${fileExt}`;
      const filePath = `${user.id}/${listingIdForUpload}/${fileName}`;

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Check if profile is loaded
    if (!userProfile) {
      setErrorMessage("Profile not loaded. Please refresh and try again.");
      setShowErrorDialog(true);
      return;
    }

    // Validation
    const totalImages = existingImages.length + images.length;
    if (totalImages === 0) {
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
        status: formData.status,
      };

      if (isEditing && listingId) {
        // UPDATE existing listing

        // Upload new images if any
        let newImageUrls = [];
        if (images.length > 0) {
          try {
            newImageUrls = await uploadImages(listingId);
          } catch (uploadError) {
            console.error("Image upload failed:", uploadError);
            setErrorMessage("Failed to upload images. Please try again.");
            setShowErrorDialog(true);
            setIsSubmitting(false);
            return; // Exit without updating listing
          }
        }

        // Combine existing and new images
        const allImages = [...existingImages, ...newImageUrls];

        // Ensure we still have at least one image
        if (allImages.length === 0) {
          setErrorMessage("Listing must have at least one image.");
          setShowErrorDialog(true);
          setIsSubmitting(false);
          return;
        }

        // Update listing only if images are valid
        const { error: updateError } = await supabase
          .from("listings")
          .update({
            ...listingData,
            images: allImages,
            updated_at: new Date().toISOString(),
          })
          .eq("id", listingId);

        if (updateError) throw updateError;

        setShowSuccessDialog(true);
      } else {
        // CREATE new listing - Upload images FIRST before creating listing

        let imageUrls = [];
        let tempListingId = null;

        try {
          // Step 1: Create a temporary listing to get an ID for image upload
          const { data: listing, error: listingError } = await supabase
            .from("listings")
            .insert([
              {
                ...listingData,
                images: [],
                status: "draft", // Mark as draft initially
              },
            ])
            .select()
            .single();

          if (listingError) throw listingError;
          tempListingId = listing.id;

          // Step 2: Upload images - this is the critical step
          try {
            imageUrls = await uploadImages(tempListingId);
          } catch (uploadError) {
            console.error("Image upload failed:", uploadError);

            // ROLLBACK: Delete the listing if image upload fails
            await supabase.from("listings").delete().eq("id", tempListingId);

            throw new Error("Failed to upload images. Please try again.");
          }

          // Step 3: Verify images were uploaded
          if (!imageUrls || imageUrls.length === 0) {
            // ROLLBACK: Delete the listing if no images
            await supabase.from("listings").delete().eq("id", tempListingId);

            throw new Error("No images were uploaded. Please try again.");
          }

          // Step 4: Update listing with images and set status to active
          const { error: updateError } = await supabase
            .from("listings")
            .update({
              images: imageUrls,
              status: "active", // Now mark as active
            })
            .eq("id", tempListingId);

          if (updateError) {
            // ROLLBACK: Delete the listing if update fails
            await supabase.from("listings").delete().eq("id", tempListingId);

            throw updateError;
          }

          setShowSuccessDialog(true);
        } catch (error) {
          // If anything fails and listing was created, ensure cleanup
          if (tempListingId) {
            try {
              await supabase.from("listings").delete().eq("id", tempListingId);
            } catch (cleanupError) {
              console.error("Failed to cleanup listing:", cleanupError);
            }
          }
          throw error;
        }
      }

      // Reset form if creating
      if (!isEditing) {
        setFormData({
          title: "",
          description: "",
          price: "",
          category: "",
          condition: "",
          status: "active",
        });
        setImages([]);
        setImagePreviews([]);
        setExistingImages([]);
        setUploadProgress(0);
      }

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      console.error("Error saving listing:", error);
      setErrorMessage(
        error.message || "Something went wrong. Please try again"
      );
      setShowErrorDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalImages = existingImages.length + images.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}

      <Header
        currentPage={"create"}
        isEditing={isEditing}
        isOwnProfile={true}
      />
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
              Photos (Required) - {totalImages}/8
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Upload Button */}
              {totalImages < 8 && (
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

          {/* Status - Only show when editing */}
          {isEditing && (
            <div>
              <label className="block font-semibold mb-2 text-gray-900 dark:text-white">
                Listing Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={isSubmitting}
                required
              >
                <option value="active">Active - Visible to buyers</option>
                <option value="sold">Sold - Marked as sold</option>
                <option value="expired">Expired - No longer available</option>
              </select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Change status to sold when you've completed the sale
              </p>
            </div>
          )}

          {/* Safety Notice */}
          <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Shield className="w-5 h-5 text-blue-900 dark:text-blue-400 mt-0.5 shrink-0" />
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
                  {isEditing ? "Updating Listing..." : "Creating Listing..."}
                </>
              ) : isEditing ? (
                "Update Listing"
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
              {isEditing
                ? "Listing Updated Successfully! 🎉"
                : "Listing Created Successfully! 🎉"}
            </DialogTitle>
            <DialogDescription className="text-center dark:text-gray-400">
              {isEditing
                ? "Your listing has been updated and is now live."
                : "Your item is now live and visible to students at University of Ibadan."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={() => router.push("/profile")}
                  className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                >
                  Back to Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/browse/${listingId}`)}
                  className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  View Listing
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setShowSuccessDialog(false)}
                  className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                >
                  Create Another Listing
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/browse")}
                  className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Browse Listings
                </Button>
              </>
            )}
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
    </>
  );
}
