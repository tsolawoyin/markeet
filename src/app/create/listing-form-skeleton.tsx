// ============================================
// FILE: app/listing/create/listing-form-skeleton.tsx
// ============================================

export function ListingFormSkeleton({ isEditing }: { isEditing: boolean }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header Skeleton */}
            <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                    </div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
            </nav>

            {/* Form Skeleton */}
            <div className="max-w-3xl mx-auto px-4 py-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-6 border border-gray-200 dark:border-gray-700 animate-pulse">
                    {/* User info skeleton */}
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-48"></div>
                    </div>

                    {/* Image upload skeleton */}
                    <div className="space-y-3">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg"
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Form fields skeleton */}
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    ))}

                    {/* Submit button skeleton */}
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        </div>
    );
}