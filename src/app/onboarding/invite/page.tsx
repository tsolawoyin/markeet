"use client";

import { useState, useContext } from "react";
import { ShellContext } from "@/shell/shell";
import {
  Share2,
  Copy,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Users,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function ShareOnboardingPage() {
  const { user } = useContext(ShellContext);
  const [copied, setCopied] = useState(false);
  const shareUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://markeet.app";
  const shareText =
    "Check out Markeet - the campus marketplace for students! Buy and sell textbooks, furniture, electronics, and more.";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Markeet - Campus Marketplace",
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or share failed
        console.log("Share cancelled or failed:", error);
      }
    } else {
      // Fallback to copy
      handleCopyLink();
    }
  };

  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(
      shareText + " " + shareUrl
    )}`;
    window.open(url, "_blank");
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-slate-950 dark:text-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="mb-8">
            <Image
              src="/welcome.jpg"
              alt="Markeet Community"
              width={200}
              height={200}
              className="w-full max-w-md rounded-lg object-cover mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">
            You're All Set! 🎉
          </h1>
          <p className="text-lg text-center text-muted-foreground">
            Help us build a stronger campus community
          </p>
        </div>

        {/* Share Section */}
        <div className="bg-card border border-border rounded-xl p-8 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl font-semibold mb-8">Spread the Word</h2>

          <div className="space-y-6">
            {/* Main Share Section */}
            <div className="pb-6 border-b border-border dark:border-slate-800">
              <div className="flex items-start gap-3 mb-6">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold">Invite Your Friends</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The more students using Markeet, the better deals everyone
                    finds! Share with your classmates and help grow our
                    community.
                  </p>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="ml-8 space-y-3">
                {/* Native Share Button (Mobile) */}
                {typeof navigator !== "undefined" && (
                  <Button
                    onClick={handleNativeShare}
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
                    size="default"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Markeet
                  </Button>
                )}

                {/* Copy Link Button */}
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="w-full"
                  size="default"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Link
                    </>
                  )}
                </Button>

                {/* Social Share Options */}
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-3">
                    Or share on:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={shareOnWhatsApp}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <MessageCircle className="mr-1 h-3 w-3" />
                      WhatsApp
                    </Button>
                    <Button
                      onClick={shareOnTwitter}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <svg
                        className="mr-1 h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      Twitter
                    </Button>
                    <Button
                      onClick={shareOnFacebook}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <svg
                        className="mr-1 h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Why It Matters Section */}
            <div>
              <div className="flex items-start gap-3 mb-4">
                <Heart className="h-5 w-5 text-red-500 dark:text-red-400 mt-1 shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold">
                    Why Your Help Matters
                  </h3>
                </div>
              </div>

              <ul className="ml-8 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>
                    <strong>More listings</strong> - More users means more items
                    to buy and sell
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>
                    <strong>Better deals</strong> - Increased competition leads
                    to fairer prices
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>
                    <strong>Faster sales</strong> - Find buyers for your items
                    more quickly
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>
                    <strong>Stronger community</strong> - Support fellow
                    students and reduce waste
                  </span>
                </li>
              </ul>
            </div>

            {/* Thank You Message */}
            <div className="bg-linear-to-br rounded-lg p-6 border border-blue-200 dark:border-blue-800/50">
              <p className="text-center text-sm">
                <strong className="text-blue-700 dark:text-blue-400">
                  Thank you for joining Markeet!
                </strong>
                <br />
                <span className="text-muted-foreground">
                  We're excited to have you as part of our growing campus
                  community. Together, we're making student life more affordable
                  and sustainable.
                </span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border dark:border-slate-800">
            <p className="text-sm text-muted-foreground mb-4">
              Ready to start exploring? Head to the marketplace and discover
              great deals!
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Go to Marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
