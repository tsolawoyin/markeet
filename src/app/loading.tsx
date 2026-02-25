export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 gap-6">
      {/* Spinner */}
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-[3px] border-stone-200 dark:border-stone-800" />
        <div className="absolute inset-0 w-10 h-10 rounded-full border-[3px] border-transparent border-t-orange-500 animate-spin" />
      </div>

      {/* Brand */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-lg font-bold text-stone-900 dark:text-white tracking-tight">
          Markeet
        </p>
        <p className="text-xs text-stone-400 dark:text-stone-500">
          Campus Marketplace
        </p>
      </div>
    </div>
  );
}
