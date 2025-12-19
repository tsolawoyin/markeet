'use client';

import { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Menu,
  X,
  Zap,
  Heart,
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function MarketHomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const painPoints = [
    {
      icon: Clock,
      title: "Trekking Halls All Day",
      desc: "Walking between halls, climbing stairs, knocking doors. You're exhausted by evening and still haven't found what you need."
    },
    {
      icon: AlertTriangle,
      title: "No Trust & Safety",
      desc: "Worried about scams, fake products, or overpaying. Hard to verify sellers when everyone's a stranger."
    },
    {
      icon: Users,
      title: "Scattered & Disconnected",
      desc: "Students with items and students needing items never meet. Listings scattered across WhatsApp groups and shouts."
    }
  ];

  const solutions = [
    {
      icon: Shield,
      title: "UI Students Only",
      desc: "Verified through your @stu.ui.edu.ng email. Safe, trusted community.",
      color: "blue"
    },
    {
      icon: Zap,
      title: "List in 2 Minutes",
      desc: "Photo. Price. Done. Fast and simple, no complications.",
      color: "amber"
    },
    {
      icon: Users,
      title: "Find Nearby",
      desc: "See items in your hall first. Easy meetups at safe locations.",
      color: "slate"
    },
    {
      icon: Heart,
      title: "Free Forever",
      desc: "No fees. No premium. Free for all UItes, always.",
      color: "green"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg shadow-md border-b border-slate-200 dark:border-slate-800'
          : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-500">
                Markeet
              </span>
            </div>

            {/* <div className="hidden md:flex items-center gap-6">
              <a href="#problem" className="text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition">
                The Problem
              </a>
              <a href="#solution" className="text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition">
                The Solution
              </a>
              <a href="#vision" className="text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition">
                The Vision
              </a>
              <a href="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition">
                Login
              </a>
              <a
                href="/sign-up"
                className="px-6 py-2.5 bg-blue-900 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700 transition transform hover:scale-105 shadow-lg"
              >
                Sign Up Free
              </a>
            </div> */}

            {/* <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button> */}
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-4">
                <a href="#problem" className="text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition">
                  The Problem
                </a>
                <a href="#solution" className="text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition">
                  The Solution
                </a>
                <a href="#vision" className="text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition">
                  The Vision
                </a>
                <a href="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition">
                  Login
                </a>
                <a
                  href="/sign-up"
                  className="px-6 py-2.5 bg-blue-900 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700 transition text-center"
                >
                  Sign Up Free
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Buy & Sell on Campus
            <span className="block text-blue-600 dark:text-blue-500">The Right Way</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            A trusted marketplace for UI students. No scams. No middlemen. Just students helping students.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="/sign-up"
              className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 font-semibold text-lg"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </a>
            <a
              href="#features"
              className="px-8 py-4 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-slate-900 transition flex items-center justify-center gap-2 font-semibold text-lg"
            >
              Learn More
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              <span>UI Verified Only</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              <span>Takes 2 Minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              The Problem
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Campus trading is broken. Let's fix it together.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {painPoints.map((pain, index) => {
              const Icon = pain.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition"
                >
                  <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-slate-600 dark:text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {pain.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {pain.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features/Solution Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Why Markeet Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Built with the features students actually need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;
              const colorMap = {
                blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-500' },
                amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-500' },
                slate: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-400' },
                green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-500' }
              };
              const colors = colorMap[solution.color];

              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition"
                >
                  <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {solution.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {solution.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 dark:bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join 10,000+ Students
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Be part of a community that's changing how students buy and sell on campus.
          </p>

          <a
            href="/sign-up"
            className="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition transform hover:scale-105 shadow-lg"
          >
            Start Free Today
            <ArrowRight className="w-5 h-5" />
          </a>

          <p className="text-sm text-slate-400 mt-4">
            No credit card • Takes 2 minutes • Completely free
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 dark:text-white mb-16">
            How It Works
          </h2>

          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Sign Up",
                desc: "Use your @stu.ui.edu.ng email. Takes 2 minutes."
              },
              {
                step: "2",
                title: "List or Browse",
                desc: "Sell items or find what you need from verified students."
              },
              {
                step: "3",
                title: "Meet & Trade",
                desc: "Connect with buyers/sellers safely on campus."
              }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 dark:bg-blue-700">
                    <span className="text-white font-bold text-lg">{item.step}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 dark:text-white mb-16">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Is this really free?",
                a: "Yes, 100% free. No hidden charges, no premium features. We're just building something useful for students."
              },
              {
                q: "How do I know people are real?",
                a: "Everyone on Markeet uses their UI email (@stu.ui.edu.ng). That's your verification."
              },
              {
                q: "What if I have a problem?",
                a: "Reach out directly. We're here to help. Email: t.olawoyin@outlook.com"
              },
              {
                q: "Do I have to sell to join?",
                a: "Nope. Just sign up. You can browse first and sell whenever you're ready."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700"
              >
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  Q: {faq.q}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  A: {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Join?
          </h2>
          <p className="text-lg text-blue-50 mb-10 max-w-2xl mx-auto">
            Start buying and selling on campus today. Free forever, no credit card needed.
          </p>
          <a
            href="/sign-up"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-blue-600 hover:bg-slate-100 rounded-lg font-semibold text-lg transition transform hover:scale-105 shadow-lg"
          >
            Sign Up Now
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 dark:bg-black border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Markeet</h3>
              <p className="text-slate-400 text-sm">
                A student marketplace. By UI students, for UI students.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="/sign-up" className="hover:text-white transition">
                    Sign Up
                  </a>
                </li>
                <li>
                  <a href="/login" className="hover:text-white transition">
                    Login
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Features
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
              <p className="text-slate-400 text-sm">
                Have feedback? Email us at t.olawoyin@outlook.com
              </p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8">
            <p className="text-center text-slate-500 text-sm">
              © 2025 Markeet. Built for the UI community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}