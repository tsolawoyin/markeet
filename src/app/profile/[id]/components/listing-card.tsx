// ============================================
// FILE: app/profile/components/listing-card.tsx
// ============================================

"use client";

import { useState, useContext } from "react";
import { ShellContext } from "@/shell/shell";
import { Eye, Clock, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
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

const gradientColors = [
    "from-blue-100 to-blue-200",
    "from-purple-100 to-purple-200",
    "from-green-100 to-green-200",
];

export default function ListingCard({
    listing,
    showActions = false,
    onUpdate,
}: {
    listing: any;
    showActions?: boolean;
    onUpdate?: () => void;
}) {
    const { supabase } = useContext(ShellContext);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const getTimeAgo = (date: string) => {
        const now = new Date();
        const posted = new Date(date);
        const diffMs = now.getTime() - posted.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        return `${Math.floor(diffDays / 30)}mo ago`;
    };

    const getGradientColor = (category: string) => {
        const index =
            category === "textbooks" ? 0 : category === "phones & laptops" ? 1 : 2;
        return gradientColors[index];
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const { error } = await supabase
                .from("listings")
                .update({ status: "deleted" })
                .eq("id", listing.id);

            if (error) throw error;

            setShowDeleteDialog(false);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Error deleting listing:", error);
            alert("Failed to delete listing");
        } finally {
            setDeleting(false);
        }
    };

    const getStatusColor = (status: string) => {
        if (status === "active")
            return "bg-green-500 dark:bg-green-600 text-white";
        if (status === "sold") return "bg-gray-500 dark:bg-gray-600 text-white";
        return "bg-red-500 dark:bg-red-600 text-white";
    };

    return (
        <>
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition overflow-hidden">
                <Link href={`/browse/${listing.id}`}>
                    <div className="aspect-square bg-linear-to-br relative overflow-hidden">
                        {listing.images && listing.images.length > 0 ? (
                            <img
                                src={listing.images[0]}
                                alt={listing.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div
                                className={`w-full h-full bg-linear-to-br ${getGradientColor(
                                    listing.category
                                )} dark:opacity-90`}
                            ></div>
                        )}

                        {/* Price Badge */}
                        <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg text-sm font-bold text-blue-900 dark:text-blue-400 shadow-sm">
                            ₦{parseFloat(listing.price).toLocaleString()}
                        </div>

                        {/* Status Badge */}
                        <div
                            className={`absolute top-2 left-2 px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(
                                listing.status
                            )}`}
                        >
                            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                        </div>
                    </div>
                </Link>

                <div className="p-4">
                    <Link href={`/browse/${listing.id}`}>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-900 dark:hover:text-blue-400">
                            {listing.title}
                        </h3>
                    </Link>

                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{listing.views_count || 0} views</span>
                        </div>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{getTimeAgo(listing.created_at)}</span>
                        </div>
                    </div>

                    {showActions && (
                        <div className="flex gap-2">
                            <Link href={`/create?id=${listing.id}`} className="flex-1">
                                <button className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2">
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </button>
                            </Link>
                            <button
                                onClick={() => setShowDeleteDialog(true)}
                                className="flex-1 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="dark:text-white">
                            Delete Listing
                        </AlertDialogTitle>
                        <AlertDialogDescription className="dark:text-gray-400">
                            Are you sure you want to delete "{listing.title}"? This action
                            cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}