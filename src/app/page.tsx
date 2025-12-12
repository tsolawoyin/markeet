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
  Sparkles,
  Zap,
  Heart,
  Clock,
  Target,
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
      title: "Trekking 7 Halls Under Blazing Sun",
      desc: "Climbing stairs, knocking doors, getting 'I'll think about it' responses. You're exhausted by 6pm and those items are still with you."
    },
    {
      icon: AlertTriangle,
      title: "Getting Scammed at Sango Market",
      desc: "Fake promises. Overpriced goods. You just wanted a fairly-used laptop but now you're not sure what you bought."
    },
    {
      icon: Target,
      title: "Posting in 15 WhatsApp Groups",
      desc: "Begging friends of friends. No responses. Your coursemate in Tedder has what someone in Mellanby needs, but they'll never meet."
    }
  ];

  const solutions = [
    {
      icon: Shield,
      title: "100% UI-Verified Only",
      desc: "Your @stu.ui.edu.ng email is your pass. No scammers. No outsiders. Just us.",
      color: "green"
    },
    {
      icon: Zap,
      title: "List in 2 Minutes",
      desc: "Snap a photo. Set a price. Post. Done. No complexity, no wahala.",
      color: "yellow"
    },
    {
      icon: Users,
      title: "Find Items by Hall",
      desc: "See what's in YOUR hall first. Meet at the library. Safe and simple.",
      color: "blue"
    },
    {
      icon: Heart,
      title: "Zero Naira. Forever.",
      desc: "No hidden charges. No 'premium features'. Free for every UIte, always.",
      color: "red"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-md'
          : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
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

      {/* Hero Section - The Story */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Fellow UItes,
            <span className="block mt-2 bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
              We Need to Talk...
            </span>
          </h1>

          <div className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 space-y-4 text-left md:text-center">
            <p>
              <strong className="text-gray-900 dark:text-white">My name is Temidayo</strong>, a med student (Class of 2k28), and I need just 3 minutes of your time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="/sign-up"
              className="group px-8 py-4 bg-blue-900 dark:bg-blue-600 text-white rounded-xl hover:bg-blue-800 dark:hover:bg-blue-700 transition transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 font-semibold text-lg"
            >
              Count Me In - Sign Up Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </a>
            <a
              href="#problem"
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:border-blue-900 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition flex items-center justify-center gap-2 font-semibold text-lg"
            >
              Read My Story
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">UI Verified Only</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">100% Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Built by a UIte, FOR UItes</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              The Problem We All Know Too Well 🥵
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Picture this: It's 2pm. The sun is blazing. You're climbing the stairs of Awo Hall for the 15th time today,
              carrying textbooks you're trying to sell because school fees is breathing down your neck...
            </p>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mt-4 leading-relaxed">
              <strong className="text-gray-900 dark:text-white">Sound familiar? Yeah, I thought so.</strong>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {painPoints.map((pain, index) => {
              const Icon = pain.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-2 border-red-200 dark:border-red-900/30"
                >
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {pain.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {pain.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-8 md:p-12 border-2 border-red-200 dark:border-red-800">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Here's What Breaks My Heart 💔
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                As someone from <strong className="text-blue-900 dark:text-blue-400">Independence Hall</strong>, I see it every day.
                Hustlers moving from room to room, hall to hall, under this Ibadan sun. Students with genuine products, genuine needs,
                but no easy way to connect.
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-6">
                We're 40,000+ strong in this university, but sometimes it feels like we're all scattered islands.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Aha Moment */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-900 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Sparkles className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            The "Aha!" Moment 💡
          </h2>
          <div className="space-y-6 text-lg md:text-xl text-blue-100 dark:text-gray-300">
            <p className="leading-relaxed">
              One evening, after watching another exhausted student drag himself out of my block after marketing all day, I asked myself:
            </p>
            <p className="text-2xl md:text-3xl font-bold text-white">
              "Why are we still doing things the analog way in 2025?"
            </p>
            <p className="leading-relaxed">
              We're the smartphone generation. We order food online. We stream lectures. We download notes in seconds.
              But when it comes to buying and selling on campus? <strong className="text-white">We're still knocking on doors like it's 1985.</strong>
            </p>
            <p className="text-xl font-bold text-yellow-400">
              That didn't make sense to me. So I built something.
            </p>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section id="solution" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              🚀 Introducing MARKEET
            </h2>
            <p className="text-xl md:text-2xl text-blue-900 dark:text-blue-400 font-semibold">
              Not just another app. OUR app. Built by a UIte, FOR UItes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;
              const colorMap = {
                green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
                yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' },
                blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
                red: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' }
              };
              const colors = colorMap[solution.color];

              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 ${colors.text}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {solution.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {solution.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Ask */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              🎯 But Here's Why I'm Writing This Today...
            </h2>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-8">
              I need YOUR help.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-xl mb-12 border-2 border-blue-900 dark:border-blue-600">
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              I've built the engine. The platform is live and working. But a marketplace is nothing without people.
              <strong className="text-gray-900 dark:text-white"> It's like building a stadium and having no one show up for the match.</strong>
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Here's My Honest Ask:
              </h3>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-400 mb-4">
                Even if you have nothing to sell right now, please sign up.
              </p>
            </div>

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <p className="text-lg leading-relaxed">
                  <strong className="text-gray-900 dark:text-white">Your classmate</strong> who's trying to sell their MTH 101 textbook needs YOU to be there as a potential buyer
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <p className="text-lg leading-relaxed">
                  <strong className="text-gray-900 dark:text-white">The fresher</strong> looking for affordable hostel items needs YOU to have already uploaded what you're done with
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <p className="text-lg leading-relaxed">
                  <strong className="text-gray-900 dark:text-white">The final year student</strong> selling their laptop before NYSC needs YOU to see their listing
                </p>
              </div>
            </div>

            <p className="text-xl font-bold text-center text-blue-900 dark:text-blue-400 mt-8">
              We rise by lifting each other. That's the UI spirit, right?
            </p>
          </div>

          <div className="text-center">
            <a
              href="/sign-up"
              className="inline-flex items-center gap-2 px-10 py-5 bg-blue-900 dark:bg-blue-600 text-white rounded-xl hover:bg-blue-800 dark:hover:bg-blue-700 transition transform hover:scale-105 shadow-2xl font-bold text-xl"
            >
              Yes, Count Me In - Sign Up Now
              <ArrowRight className="w-6 h-6" />
            </a>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Takes less than 2 minutes • No credit card needed • Free forever
            </p>
          </div>
        </div>
      </section>

      {/* The Vision */}
      <section id="vision" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              🔥 The Vision is Simple but Powerful
            </h2>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-2xl p-8 md:p-12 text-white shadow-2xl mb-12">
            <p className="text-xl md:text-2xl font-semibold mb-8">
              Imagine a UI where:
            </p>
            <div className="space-y-4">
              {[
                "No student has to trek 7 halls to sell a textbook",
                "No one gets scammed buying fake electronics outside campus",
                "Finding what you need is as easy as opening an app",
                "Students support students, directly, no middlemen chopping our money"
              ].map((point, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Star className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <p className="text-lg leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
            <p className="text-2xl font-bold mt-8 text-center">
              That's the UI I want to help build. But I can't do it alone.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              💪 My Personal Commitment to You
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-center">
              I'm not some big tech company. I'm just <strong className="text-blue-900 dark:text-blue-400">Temidayo from Independence Hall</strong>,
              trying to make life easier for all of us.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {[
                "I'll keep improving Markeet based on YOUR feedback",
                "I'll never sell your data or spam you",
                "I'll keep it simple, fast, and useful",
                "I'll make sure it works on any device"
              ].map((promise, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{promise}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Numbers */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-900 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
            Let's Make History Together
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="bg-white/10 dark:bg-gray-700/50 rounded-xl p-6">
              <div className="text-4xl font-bold text-white mb-2">10,000</div>
              <div className="text-blue-100 dark:text-gray-300">UItes = Markeet becomes useful</div>
            </div>
            <div className="bg-white/10 dark:bg-gray-700/50 rounded-xl p-6">
              <div className="text-4xl font-bold text-white mb-2">20,000</div>
              <div className="text-blue-100 dark:text-gray-300">UItes = Markeet becomes powerful</div>
            </div>
            <div className="bg-white/10 dark:bg-gray-700/50 rounded-xl p-6">
              <div className="text-4xl font-bold text-yellow-400 mb-2">30,000+</div>
              <div className="text-blue-100 dark:text-gray-300">UItes = Strongest student marketplace in Nigeria 🚀</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            🙏 My Final Appeal
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            I'm not asking you to spend money. I'm not asking you to commit hours.
            <strong className="text-gray-900 dark:text-white"> I'm asking for 2 minutes of your time to help build something that could change how we all trade on campus.</strong>
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl mb-8 border-2 border-blue-900 dark:border-blue-600">
            <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Let's prove that UI students can build and support our own.
            </p>
            <p className="text-xl text-blue-900 dark:text-blue-400 font-semibold">
              Let's show other schools what unity and innovation look like.
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              Are you in?
            </p>
            <a
              href="/sign-up"
              className="inline-flex items-center gap-3 px-12 py-6 bg-blue-900 dark:bg-blue-600 text-white rounded-2xl hover:bg-blue-800 dark:hover:bg-blue-700 transition transform hover:scale-105 shadow-2xl font-bold text-xl md:text-2xl"
            >
              YES, COUNT ME IN - SIGN UP NOW
              <ArrowRight className="w-7 h-7" />
            </a>
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm">Takes less than 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm">No credit card needed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm">Free forever</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              💭 Quick FAQs
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Because I know you're thinking...
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "I don't have anything to sell",
                a: "You might not today, but you will eventually. Plus, someone needs YOU as a buyer."
              },
              {
                q: "Will this add to my data consumption?",
                a: "It's super light. Less data than scrolling Instagram for 5 minutes."
              },
              {
                q: "What if I have issues?",
                a: "I'm a real person. You can literally reach me. My commitment is to keep fixing and improving."
              },
              {
                q: "Is this legit?",
                a: "As legit as my matric number. This is a passion project to help us all. Not a scam. Not a data harvesting scheme. Just genuine UIte love."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Q: {faq.q}
                </h3>
                <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                  A: {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 to-blue-800 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl md:text-2xl text-blue-100 dark:text-gray-300 mb-8 leading-relaxed">
            Much love and respect,
          </p>
          <p className="text-4xl md:text-5xl font-bold text-white mb-4">
            Temidayo 💙💛
          </p>
          <div className="space-y-1 text-blue-100 dark:text-gray-400">
            <p className="text-lg">Medicine & Surgery, Class of 2k28</p>
            <p className="text-lg">Independence Hall | Software Developer</p>
            <p className="text-lg font-semibold">Fellow UIte Just Trying to Help</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 dark:bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">Markeet</h3>
              <p className="text-gray-400 text-sm">
                A student marketplace by UItes, for UItes.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#problem" className="hover:text-white transition">
                    The Problem
                  </a>
                </li>
                <li>
                  <a href="#solution" className="hover:text-white transition">
                    The Solution
                  </a>
                </li>
                <li>
                  <a href="#vision" className="hover:text-white transition">
                    The Vision
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/login" className="hover:text-white transition">
                    Login
                  </a>
                </li>
                <li>
                  <a href="/sign-up" className="hover:text-white transition">
                    Sign Up
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
              <p className="text-sm text-gray-400">
                Have questions or feedback? I would love to hear from you. Reach me @ t.olawoyin@outlook.com
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-500 text-sm">
              © 2025 Markeet. All rights reserved. Built with 💙 for the UI community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}