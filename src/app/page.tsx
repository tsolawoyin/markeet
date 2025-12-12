"use client";

import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  BookOpen,
  Laptop,
  Home,
  Shield,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Zap,
  Heart
} from 'lucide-react';

export default function MarkeетLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { icon: BookOpen, name: "Textbooks", color: "blue", desc: "All your course materials" },
    { icon: Laptop, name: "Electronics", color: "purple", desc: "Phones & laptops" },
    { icon: Home, name: "Hostel Essentials", color: "green", desc: "From buckets to bedsheets" }
  ];

  const features = [
    { icon: Shield, title: "Campus Verified", desc: "Only @stu.ui.edu.ng emails allowed" },
    { icon: Users, title: "Hall-Based", desc: "Find items in your hall first" },
    { icon: Zap, title: "Lightning Fast", desc: "List in 2 minutes, sell in hours" },
    { icon: TrendingUp, title: "Fair Prices", desc: "Student-friendly pricing" }
  ];

  const testimonials = [
    {
      name: "Bodunde Blessing",
      course: "400L Dentistry",
      text: "Finally sold my old Anatomy textbooks! Met the buyer at Kenneth Dike Library. No stress, no wahala. Markeet is the real deal!",
      avatar: "BB",
      rating: 5
    },
    // {
    //   name: "Apera Member",
    //   course: "100L Physiology",
    //   text: "As a fresher, I didn't know where to get affordable hostel stuff. Markeet saved me from those Sango market prices. God bless this app! 😂",
    //   avatar: "AM",
    //   rating: 5
    // },
    // {
    //   name: "Chukwudi Okafor",
    //   course: "300L Computer Science",
    //   text: "Sold my Redmi Note 10 in 3 hours! The buyer was even in Mellanby Hall like me. Too smooth!",
    //   avatar: "CO",
    //   rating: 5
    // }
  ];

  const stats = [
    { number: "Secure", label: "Campus Verified" },
    { number: "Fast", label: "List Items Instantly" },
    { number: "Easy", label: "Simple Interface" },
    { number: "Free", label: "Forever" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-md'
        : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div> */}
              <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                Markeet
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition">
                How It Works
              </a>
              <a href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition">
                Reviews
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
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-in slide-in-from-top">
              <div className="flex flex-col gap-4">
                {/* <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition">
                  How It Works
                </a>
                <a href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition">
                  Reviews
                </a> */}
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
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-in slide-in-from-left duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6 animate-pulse">
                <Sparkles className="w-4 h-4 text-blue-900 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-400">
                  Just Launched! Be Part of the Movement 🚀
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Buy & Sell on Campus
                <span className="block bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                  Without Stress
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
                Our mission: to make buying and selling among students easy, fast, and secure.
                Trade textbooks, electronics, hostel essentials, and more with fellow UItes on campus.
                <span className="font-semibold"> No middlemen. No hidden fees. Just simple, honest trading.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href="/sign-up"
                  className="group px-8 py-4 bg-blue-900 dark:bg-blue-600 text-white rounded-xl hover:bg-blue-800 dark:hover:bg-blue-700 transition transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 font-semibold text-lg"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="#how-it-works"
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:border-blue-900 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition flex items-center justify-center gap-2 font-semibold text-lg"
                >
                  See How It Works
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">UI Verified Only</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">List in 2 Minutes</span>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image Placeholder */}
            {/* <div className="relative animate-in slide-in-from-right duration-700">
              <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 p-8 shadow-2xl">
                <div className="w-full h-full bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm flex items-center justify-center border-2 border-dashed border-blue-300 dark:border-blue-600">
                  <div className="text-center">
                    <ShoppingBag className="w-20 h-20 mx-auto mb-4 text-blue-900 dark:text-blue-400 opacity-50" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      [Add Hero Image Here]
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      Students browsing items on Markeet
                    </p>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">Secure</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Campus Verified</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">Fast</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Instant Listings</div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-blue-900 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-blue-100 dark:text-gray-300">Built to serve UI students with integrity</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-in zoom-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-200 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              What Students Are Buying & Selling
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need for campus life, all in one place
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 animate-in zoom-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`w-16 h-16 bg-${category.color}-100 dark:bg-${category.color}-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 text-${category.color}-600 dark:text-${category.color}-400`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {category.desc}
                  </p>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why UItes Love Markeet
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Built by students, for students. No cap! 💯
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 animate-in fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Start Trading in 3 Easy Steps
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              E choke! It's that simple. Trust me 😎
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "1",
                title: "Sign Up with UI Email",
                desc: "Use your @stu.ui.edu.ng email. We verify you're really a UIte (no japa!)."
              },
              {
                step: "2",
                title: "List or Browse Items",
                desc: "Upload photos, set your price, and post in 2 minutes. Or browse what others are selling."
              },
              {
                step: "3",
                title: "Meet & Trade on Campus",
                desc: "Connect with sellers in your hall. Meet at Library, SUB, or anywhere safe on campus."
              }
            ].map((item, index) => (
              <div
                key={index}
                className="relative animate-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-6 shadow-lg transform hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.desc}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 -right-6 w-12 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Early Feedback From Beta Users
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Hear from the first UItes testing Markeet
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div>
                  <div className="font-bold text-xl text-gray-900 dark:text-white">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {testimonials[currentTestimonial].course}
                  </div>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 italic leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </p>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentTestimonial
                    ? 'bg-blue-600 dark:bg-blue-400 w-8'
                    : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ambassadors Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Campus Ambassadors
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The real MVPs making Markeet happen at UI! 🙌
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Ambassador 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200 dark:border-gray-600">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg">
                {/* Placeholder for ambassador photo */}
                <div className="text-white text-2xl font-bold">BB</div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Bodunde Blessing
                </h3>
                <p className="text-blue-900 dark:text-blue-400 font-semibold mb-1">
                  Campus Ambassador
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  400L Dentistry Student, UI
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Verified UIte</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Want to become a campus ambassador? We're always looking for passionate UItes!
            </p>
            <a
              href="mailto:t.olawoyin@outlook.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold shadow-lg"
            >
              <Users className="w-5 h-5" />
              Apply to be an Ambassador
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 to-blue-700 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Start Trading the Smart Way
          </h2>
          <p className="text-xl text-blue-100 dark:text-gray-300 mb-8">
            Join us in creating a safer, easier marketplace for UI students. Be part of something special from day one.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="/sign-up"
              className="group px-10 py-5 bg-white text-blue-900 rounded-xl hover:bg-gray-100 transition transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2 font-bold text-xl"
            >
              Sign Up Now - It's Free!
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition" />
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-blue-100 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Takes less than 2 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>100% free forever</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 dark:bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div> */}
                <span className="text-2xl font-bold">Markeet</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Making buying and selling among UI students easy, fast, and secure.
                A startup by students, for students.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-900 dark:bg-blue-800 rounded-lg text-sm">UI Verified</span>
                <span className="px-3 py-1 bg-green-900 dark:bg-green-800 rounded-lg text-sm">100% Free</span>
              </div>
            </div>

            {/* Quick Links */}
            {/* <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#testimonials" className="hover:text-white transition">Testimonials</a></li>
                <li><a href="/browse" className="hover:text-white transition">Browse Items</a></li>
              </ul>
            </div> */}

            {/* Support */}
            {/* <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Safety Tips</a></li>
                <li><a href="#" className="hover:text-white transition">Community Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div> */}
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row items-center md:text-left justify-between gap-4">
              <p className="text-gray-400 text-sm">
                © 2025 Markeet. Made with ❤️ for UI students by UI students.
              </p>
              <div className="flex gap-4 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition">Privacy Policy</a>
                <a href="#" className="hover:text-white transition">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}