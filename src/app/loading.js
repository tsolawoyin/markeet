import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Loader className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
    </div>
  );
}


// import { Loader } from "lucide-react";

// export default function Loading() {
//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
//       <div className="relative">
//         {/* Pulsing background circle */}
//         <div className="absolute inset-0 -m-8 bg-blue-500/10 dark:bg-blue-400/10 rounded-full animate-pulse" />

//         {/* Main content */}
//         <div className="relative flex flex-col items-center gap-6">
//           {/* Spinning loader with glow effect */}
//           <div className="relative">
//             <div className="absolute inset-0 blur-xl bg-blue-500/30 dark:bg-blue-400/30 rounded-full animate-pulse" />
//             <Loader className="relative w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
//           </div>

//           {/* Brand name with staggered fade-in */}
//           <div className="flex items-center gap-0.5 font-bold text-3xl">
//             <span className="text-blue-900 dark:text-blue-400 animate-[fade-in_0.6s_ease-in-out_0.1s_both]">
//               M
//             </span>
//             <span className="text-blue-800 dark:text-blue-300 animate-[fade-in_0.6s_ease-in-out_0.2s_both]">
//               a
//             </span>
//             <span className="text-blue-700 dark:text-blue-300 animate-[fade-in_0.6s_ease-in-out_0.3s_both]">
//               r
//             </span>
//             <span className="text-blue-600 dark:text-blue-400 animate-[fade-in_0.6s_ease-in-out_0.4s_both]">
//               k
//             </span>
//             <span className="text-blue-700 dark:text-blue-300 animate-[fade-in_0.6s_ease-in-out_0.5s_both]">
//               e
//             </span>
//             <span className="text-blue-800 dark:text-blue-300 animate-[fade-in_0.6s_ease-in-out_0.6s_both]">
//               e
//             </span>
//             <span className="text-blue-900 dark:text-blue-400 animate-[fade-in_0.6s_ease-in-out_0.7s_both]">
//               t
//             </span>
//           </div>

//           {/* Subtle tagline */}
//           <p className="text-sm text-gray-500 dark:text-gray-400 animate-[fade-in_0.8s_ease-in-out_1s_both] tracking-wide">
//             Campus Marketplace
//           </p>
//         </div>

//         {/* Decorative dots */}
//         <div className="absolute -top-12 -right-12 w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-ping" />
//         <div
//           className="absolute -bottom-8 -left-8 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-ping"
//           style={{ animationDelay: "0.5s" }}
//         />
//       </div>
//     </div>
//   );
// }
