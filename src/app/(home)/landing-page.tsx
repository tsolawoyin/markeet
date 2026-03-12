import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Bell,
  Store,
  CreditCard,
  PackageCheck,
} from "lucide-react";
import { type Listing } from "@/components/listing-card";
import ListingCard from "@/components/listing-card";

interface LandingPageProps {
  listings: Listing[];
  students: number;
}

export function LandingPage({ listings, students }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-stone-950">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 lg:px-8 flex items-center justify-between py-5">
        <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
          Markeet
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/sign-up"
            className="text-sm font-medium px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 dark:text-white leading-[1.15]">
            The marketplace built
            <br />
            <span className="text-orange-600 dark:text-orange-400">
              for UI students
            </span>
          </h1>
          <p className="mt-5 text-lg text-stone-600 dark:text-stone-400 max-w-lg mx-auto">
            Buy and sell with fellow verified students on campus. Every
            transaction is protected by escrow — so your money is always safe.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-7 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors"
            >
              Get started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/view/category/all"
              className="inline-flex items-center gap-2 px-7 py-3 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-medium rounded-xl hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
            >
              Browse listings
            </Link>
          </div>
          {students > 0 && (
            <p className="mt-6 text-sm text-stone-500 dark:text-stone-400">
              Trusted by{" "}
              <span className="font-semibold text-stone-700 dark:text-stone-300">
                {students}+ UI students
              </span>
            </p>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-stone-50 dark:bg-stone-900/50 py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-stone-900 dark:text-white">
            How it works
          </h2>
          <p className="text-center mt-2 text-stone-500 dark:text-stone-400">
            Three simple steps to start buying or selling
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <Step
              number="1"
              icon={<GraduationCap className="w-5 h-5" />}
              title="Verify your identity"
              description="Sign up with your UI credentials. Only verified students can join the platform."
            />
            <Step
              number="2"
              icon={<Store className="w-5 h-5" />}
              title="List or browse"
              description="Post items you want to sell, or browse listings from other students on campus."
            />
            <Step
              number="3"
              icon={<CreditCard className="w-5 h-5" />}
              title="Transact safely"
              description="Pay through escrow. Money is only released to the seller after you confirm delivery."
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <h2 className="text-center text-2xl font-bold text-stone-900 dark:text-white">
          Why Markeet?
        </h2>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feature
            icon={<ShieldCheck className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
            title="Escrow protection"
            description="Your payment is held securely until you confirm that the item was delivered. If anything goes wrong, you get a full refund."
          />
          <Feature
            icon={<GraduationCap className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
            title="Verified students only"
            description="Every user is a confirmed UI student. No anonymous accounts, no outside sellers — just your fellow students."
          />
          <Feature
            icon={<Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
            title="Instant notifications"
            description="Get notified the moment someone places an order on your listing, or when new items you're interested in are posted."
          />
          <Feature
            icon={<PackageCheck className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
            title="On-campus delivery"
            description="No shipping delays. Meet sellers right on campus — at your hall, department, or any convenient spot."
          />
          <Feature
            icon={<CreditCard className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
            title="Instant withdrawals"
            description="Once a transaction is confirmed, sellers can withdraw earnings directly to their bank account instantly."
          />
          <Feature
            icon={<Store className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
            title="Free to list"
            description="No listing fees, no hidden charges. Post as many items or services as you want — completely free."
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-stone-50 dark:bg-stone-900/50 py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-stone-900 dark:text-white">
            What students are saying
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Testimonial
              quote="Just made my first sale via the Markeet App! The transaction aspect really burst my brain — the fact that you can't get your money as a seller until you deliver makes everyone safe from scammers."
              name="Sharof_Gadgets"
              role="Seller"
            />
            <Testimonial
              quote="The app requested for the code from the buyer that will authenticate the payment — I was like wow! I was able to withdraw my money immediately without any delay."
              name="Oluwaferanmi"
              role="Seller"
            />
            <Testimonial
              quote="Instead of ordering from Jumia or Temu which might take days or weeks, Markeet connects me with a local seller here inside UI without stress. Easy payment flow and quality items."
              name="Temidayo"
              role="Buyer"
            />
          </div>
        </div>
      </section>

      {/* Live listings */}
      {listings.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
              Listed right now
            </h2>
            <Link
              href="/category/all"
              className="inline-flex items-center gap-1.5 text-sm text-orange-600 dark:text-orange-400 hover:underline"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {listings.map((listing) => (
              <Link key={listing.id} href={`/listing/${listing.id}`}>
                <ListingCard listing={listing} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-linear-to-br from-orange-500 via-orange-600 to-orange-700 dark:from-orange-600 dark:via-orange-700 dark:to-orange-800 py-16 lg:py-20">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white">
            Ready to join your campus marketplace?
          </h2>
          <p className="mt-3 text-orange-100">
            Sign up, verify your account, and start buying or selling today.
          </p>
          <Link
            href="/sign-up"
            className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-white text-orange-700 font-semibold rounded-xl hover:bg-orange-50 transition-colors"
          >
            Create your account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 lg:px-8 py-8 flex items-center justify-between text-sm text-stone-400 dark:text-stone-500">
        <span>&copy; {new Date().getFullYear()} Markeet</span>
        <Link
          href="/login"
          className="hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
        >
          Log in
        </Link>
      </footer>
    </div>
  );
}

function Step({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
        {icon}
      </div>
      <p className="mt-4 text-sm font-semibold text-orange-600 dark:text-orange-400">
        Step {number}
      </p>
      <h3 className="mt-1 text-lg font-semibold text-stone-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
        {description}
      </p>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800">
      <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="mt-3 font-semibold text-stone-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function Testimonial({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <blockquote className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
      <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
        &ldquo;{quote}&rdquo;
      </p>
      <footer className="mt-4 text-sm">
        <span className="font-medium text-stone-900 dark:text-white">
          {name}
        </span>
        <span className="text-stone-400 dark:text-stone-500"> &middot; {role}</span>
      </footer>
    </blockquote>
  );
}
