import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { type Listing } from "@/components/listing-card";
import ListingCard from "@/components/listing-card";

interface LandingPageProps {
  listings: Listing[];
  students: number;
}

export function LandingPage({ listings, students }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-stone-950">
      {/* Top bar */}
      <nav className="max-w-2xl mx-auto px-6 lg:px-8 flex items-center justify-between py-6">
        <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
          Markeet
        </span>
        <Link
          href="/login"
          className="text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
        >
          Log in
        </Link>
      </nav>

      {/* The Letter */}
      <main className="max-w-2xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        <article className="space-y-6 text-[17px] leading-relaxed text-stone-700 dark:text-stone-300">
          <p>Good day, friend.</p>

          <p>
            My name is Temidayo Olawoyin, a 200L Medicine and Surgery student.
            Together with Apera Member Veronica (CEO), we cordially invite you
            to join{" "}
            <span className="font-semibold text-stone-900 dark:text-white">
              Markeet
            </span>
            .
          </p>

          <p>
            But as expected, you&apos;re probably wondering — what is Markeet?
          </p>

          <p>
            <span className="font-semibold text-stone-900 dark:text-white">
              Markeet is a marketplace created solely for UI students.
            </span>{" "}
            Only verified UI students can join. The platform is designed to make
            buying and selling among students on campus seamless. Think Jumia,
            Temu, or Amazon — but the key difference is that we don&apos;t own
            the goods and services listed. Students do.
          </p>

          <p>
            If you have a business or service you offer, you can join to
            showcase it — and the platform&apos;s job is to ensure it reaches
            thousands of UI students. If you need something instead, you can{" "}
            <Link
              href="/view/category/all"
              className="text-orange-600 dark:text-orange-400 underline underline-offset-2 hover:text-orange-700 dark:hover:text-orange-300"
            >
              browse listings from other students
            </Link>
            . It works both ways.
          </p>

          {/* Seller benefits */}
          <div>
            <p className="font-semibold text-stone-900 dark:text-white mb-3">
              As a seller:
            </p>
            <ul className="space-y-2 pl-5 list-disc marker:text-orange-400">
              <li>List items freely and easily</li>
              <li>Every user on the platform gets notified instantly</li>
              <li>
                You get notified of any orders placed on your listing
              </li>
              <li>
                When the buyer&apos;s expectations are met, you get paid
                directly on the platform
              </li>
            </ul>
          </div>

          {/* Buyer benefits */}
          <div>
            <p className="font-semibold text-stone-900 dark:text-white mb-3">
              As a buyer:
            </p>
            <ul className="space-y-2 pl-5 list-disc marker:text-orange-400">
              <li>Browse items and services posted by fellow students</li>
              <li>
                Place orders with full escrow protection — if anything goes
                wrong, your money is refunded 100%
              </li>
              <li>
                Whenever you have something to sell, you can post it too and
                enjoy all the seller benefits above
              </li>
            </ul>
          </div>

          <p>
            {students > 0 ? (
              <>
                So far,{" "}
                <span className="font-semibold text-stone-900 dark:text-white">
                  {students}+ UI students
                </span>{" "}
                have joined and are already buying and selling on the platform.
              </>
            ) : (
              <>
                We&apos;re currently in the onboarding phase — inviting as many
                UI students as possible.
              </>
            )}{" "}
            Even if you&apos;re not buying or selling anything right now, please
            sign up and invite your colleagues, roommates, and friends to join.
          </p>

          <p>
            We&apos;re working hard to build something that genuinely benefits
            students. Signing up takes less than 5 minutes. Together, let&apos;s
            build the greatest UI marketplace that ever existed.
          </p>

          <p>Thank you.</p>

          {/* Sign-off */}
          <div className="pt-4 flex items-center gap-5">
            <div className="flex -space-x-3">
              <Image
                src="/temidayo.jpeg"
                alt="Temidayo Olawoyin"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-stone-950"
              />
              <Image
                src="/veronica.jpeg"
                alt="Veronica"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-stone-950"
              />
            </div>
            <div className="text-base">
              <p className="font-medium text-stone-900 dark:text-white">
                Temidayo & Veronica
              </p>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Founders, Markeet
              </p>
            </div>
          </div>
        </article>

        {/* CTA */}
        <div className="mt-14 flex flex-col items-center gap-3">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors"
          >
            Join Markeet
            <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="text-sm text-stone-400 dark:text-stone-500">
            Takes less than 5 minutes
          </span>
        </div>

        {/* Testimonials — as forwarded messages, not a marketing section */}
        <div className="mt-20 space-y-5">
          <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
            From students who have used Markeet:
          </p>

          <blockquote className="border-l-2 border-orange-300 dark:border-orange-700 pl-4 text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
            <p>
              &ldquo;Just made my first sale via the Markeet App! The
              transaction aspect really burst my brain — I was so surprised when
              I received the notification that someone paid for my product. The
              fact that you can&apos;t get your money as a seller until you
              deliver makes everyone safe from scammers. Instant withdrawal is
              another one to talk about!&rdquo;
            </p>
            <footer className="mt-2 text-sm text-stone-500 dark:text-stone-500">
              — Sharof_Gadgets, Seller
            </footer>
          </blockquote>

          <blockquote className="border-l-2 border-orange-300 dark:border-orange-700 pl-4 text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
            <p>
              &ldquo;Yesterday I was notified on the Markeet app that someone
              has requested for the UI customized ID card Lanyard that I posted
              there, which I responded to in a jiffy and delivered it to the
              person. When I got there, the app requested for the code from the
              buyer that will authenticate the payment — I was like wow! As if
              that was not enough, I was able to withdraw my money immediately
              without any delay. I will implore everyone here to try it
              out!&rdquo;
            </p>
            <footer className="mt-2 text-sm text-stone-500 dark:text-stone-500">
              — Oluwaferanmi, Seller
            </footer>
          </blockquote>

          <blockquote className="border-l-2 border-orange-300 dark:border-orange-700 pl-4 text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
            <p>
              &ldquo;It was actually very easy for me to get an item from
              Markeet. Instead of ordering from Jumia or Temu which might take
              days or weeks, Markeet connects me with a local seller here inside
              UI without stress. Easy payment flow and quality items.&rdquo;
            </p>
            <footer className="mt-2 text-sm text-stone-500 dark:text-stone-500">
              — Temidayo, Buyer
            </footer>
          </blockquote>
        </div>

        {/* Live listings — a peek, not a catalog */}
        {listings.length > 0 && (
          <div className="mt-20 space-y-5">
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
              See what&apos;s on Markeet right now:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {listings.map((listing) => (
                <Link key={listing.id} href={`/view/listing/${listing.id}`}>
                  <ListingCard listing={listing} />
                </Link>
              ))}
            </div>

            <div className="text-center pt-2">
              <Link
                href="/view/category/all"
                className="inline-flex items-center gap-1.5 text-sm text-orange-600 dark:text-orange-400 hover:underline"
              >
                View all listings
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
