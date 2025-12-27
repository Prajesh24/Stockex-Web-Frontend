import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center px-6 py-4">
          {/* LEFT: Logo + Nav */}
          <div className="flex items-center gap-10">
            <a href="#top">
                <h1 className="text-2xl font-bold text-white">Stockex</h1>
            </a>
            

            <nav className="hidden md:flex gap-6">
              <a
                href="#features"
                className="text-gray-300 hover:text-white transition"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-300 hover:text-white transition"
              >
                How it works
              </a>
              <a
                href="#about"
                className="text-gray-300 hover:text-white transition"
              >
                About
              </a>
            </nav>
          </div>

          {/* RIGHT: CTA */}
          <div className="ml-auto">
            <Link
              href="/register"
              className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-black hover:bg-green-600 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="max-w-7xl mx-auto px-6 pt-24 pb-32 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Manage Your Portfolio. <br />
            <span className="text-green-500">See the Bigger Picture.</span>
          </h2>

          <p className="mt-6 text-lg text-gray-400">
            StockEx helps you track, visualize, and analyze your investments
            without the complexity of trading platforms.
          </p>

          <div className="mt-10 flex gap-4 flex-wrap">
            <Link
              href="/register"
              className="rounded-xl bg-green-500 px-8 py-3 text-black font-semibold hover:bg-green-600"
            >
              Start Tracking Free
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-white/20 px-8 py-3 hover:bg-white/10"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative">
          <Image
            src="/images/home.png"
            alt="StockEx portfolio dashboard"
            width={600}
            height={400}
            className="rounded-2xl border border-white/10 shadow-xl"
            priority
          />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-6 pb-28">
        <h3 className="text-3xl font-bold text-center mb-12">Features</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Portfolio Overview",
              desc: "View total value, gains, losses, and individual holdings at a glance.",
              icon: "📁",
            },
            {
              title: "Performance Tracking",
              desc: "Analyze portfolio growth over time with visual performance charts.",
              icon: "📈",
            },
            {
              title: "Asset Allocation",
              desc: "Understand diversification with sector and allocation breakdowns.",
              icon: "📊",
            },
            {
              title: "Manual Holdings",
              desc: "Add investments manually without linking brokerage accounts.",
              icon: "✍️",
            },
            {
              title: "Insightful Metrics",
              desc: "See returns, averages, and trends that matter.",
              icon: "🧠",
            },
            {
              title: "Secure & Private",
              desc: "Your portfolio data stays private and protected.",
              icon: "🔐",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-gray-900/60 p-6 backdrop-blur hover:border-green-500/40 transition"
            >
              <div className="text-2xl">{f.icon}</div>
              <h4 className="mt-4 font-semibold text-lg">{f.title}</h4>
              <p className="mt-2 text-sm text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 pb-28">
        <h3 className="text-3xl font-bold text-center mb-12">How it works</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            ["1️⃣", "Create an account"],
            ["2️⃣", "Add your holdings"],
            ["3️⃣", "Track & analyze"],
          ].map(([step, text]) => (
            <div
              key={text}
              className="rounded-2xl border border-white/10 bg-gray-900/60 p-8 backdrop-blur"
            >
              <div className="text-3xl">{step}</div>
              <p className="mt-4 text-gray-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="max-w-7xl mx-auto px-6 pb-28 text-center">
        <h3 className="text-3xl font-bold mb-6">About StockEx</h3>
        <p className="max-w-3xl mx-auto text-gray-400">
          StockEx is built for long-term investors who want clarity over their
          portfolios. It focuses on organization, insights, and visualization
          rather than trading execution.
        </p>
      </section>

      {/* CTA */}
      <section className="px-6 pb-28 text-center">
        <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900 to-black p-12">
          <h3 className="text-3xl font-bold">Take control of your portfolio</h3>
          <p className="mt-4 text-gray-400">
            Start tracking your investments with confidence and clarity.
          </p>

          <Link
            href="/register"
            className="inline-block mt-8 rounded-xl bg-green-500 px-10 py-3 text-black font-semibold hover:bg-green-600 transition"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} StockEx · Portfolio management made simple
      </footer>
    </div>
  );
}
