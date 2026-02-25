"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Store,
  Sparkles,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Shield,
  Wallet,
  Users,
  BadgeCheck,
  GraduationCap,
  PackageOpen,
} from "lucide-react";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  image: string;
  icon: typeof ShoppingBag;
  gradient: string;
}

const SLIDES: Slide[] = [
  {
    id: 0,
    title: "Welcome to the 2025/2026 Session!",
    subtitle:
      "Whether you\u2019re a fresher or a returning student \u2014 Markeet is your campus marketplace. Buy, sell, and connect with verified UI students.",
    cta: "Explore Marketplace",
    ctaLink: "/view/category/all",
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&q=80",
    icon: GraduationCap,
    gradient: "from-orange-600/80 via-orange-700/70 to-orange-900/90",
  },
  {
    id: 1,
    title: "Freshers, Get Everything You Need!",
    subtitle:
      "Resuming soon? Find affordable textbooks, mattresses, kitchen essentials, and more from fellow UI students \u2014 all in one place.",
    cta: "Browse Listings",
    ctaLink: "/view/category/all",
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&q=80",
    icon: ShoppingBag,
    gradient: "from-green-600/80 via-green-700/70 to-green-900/90",
  },
  {
    id: 2,
    title: "Leaving Campus? Sell Your Stuff",
    subtitle:
      "Don\u2019t let your items go to waste. List your belongings in minutes and find buyers within the UI community before you leave.",
    cta: "Start Selling",
    ctaLink: "/create/offer",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80",
    icon: PackageOpen,
    gradient: "from-amber-600/80 via-amber-700/70 to-amber-900/90",
  },
  {
    id: 3,
    title: "Verified UI Students Only",
    subtitle:
      "Every user is verified with their UI email. Trade safely within a trusted campus community.",
    cta: "Start Shopping",
    ctaLink: "/view/category/all",
    image:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&q=80",
    icon: BadgeCheck,
    gradient: "from-blue-600/80 via-blue-700/70 to-blue-900/90",
  },
];

const AUTO_PLAY_INTERVAL = 5000;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-play
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [paused, next]);

  const slide = SLIDES[current];
  const SlideIcon = slide.icon;

  return (
    <div
      className="relative w-full overflow-hidden rounded-none lg:rounded-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide */}
      <div className="relative h-70 sm:h-80 lg:h-95">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            initial={{ x: direction * 100 + "%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -100 + "%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority={slide.id === 0}
            />

            {/* Gradient Overlay */}
            <div
              className={`absolute inset-0 bg-linear-to-r ${slide.gradient}`}
            />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-8 lg:px-12 lg:pb-12 max-w-2xl">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.35 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <SlideIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/80 text-xs font-medium uppercase tracking-wider">
                    {slide.id === 0 && "New Session"}
                    {slide.id === 1 && "Freshers"}
                    {slide.id === 2 && "Sell Your Items"}
                    {slide.id === 3 && "Trusted Community"}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {slide.title}
                </h2>
                <p className="text-white/85 text-sm sm:text-base mt-2 max-w-md leading-relaxed">
                  {slide.subtitle}
                </p>

                <Link href={slide.ctaLink}>
                  <Button className="mt-4 bg-white text-stone-900 hover:bg-white/90 text-sm font-semibold px-6 shadow-lg">
                    {slide.cta}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows — desktop only */}
        <button
          type="button"
          onClick={prev}
          className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm items-center justify-center hover:bg-black/50 transition"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          type="button"
          onClick={next}
          className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm items-center justify-center hover:bg-black/50 transition"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 lg:bottom-5 right-6 lg:right-12 z-20 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="relative h-1.5 rounded-full overflow-hidden transition-all"
            style={{ width: i === current ? 24 : 8 }}
          >
            <div className="absolute inset-0 bg-white/40 rounded-full" />
            {i === current && (
              <motion.div
                className="absolute inset-0 bg-white rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: AUTO_PLAY_INTERVAL / 1000,
                  ease: "linear",
                }}
                key={`progress-${current}`}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
