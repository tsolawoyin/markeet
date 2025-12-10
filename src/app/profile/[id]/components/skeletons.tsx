// ============================================
// FILE: app/profile/components/skeletons.tsx
// ============================================

export function ProfileHeaderSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar skeleton */}
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>

                {/* Info skeleton */}
                <div className="flex-1 space-y-3 w-full">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto md:mx-0"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto md:mx-0"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 mx-auto md:mx-0"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto md:mx-0"></div>
                </div>
            </div>
        </div>
    );
}

export function ProfileStatsSkeleton() {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse"
                >
                    <div className="space-y-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ProfileTabsSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
            {/* Tab headers skeleton */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="flex gap-4">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
            </div>

            {/* Content skeleton */}
            <div className="p-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="space-y-3">
                            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}