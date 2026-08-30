import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBriefcase, FaFileInvoiceDollar, FaUserTie, FaBolt, FaShieldHalved, FaComments } from "react-icons/fa6";
import { MdOutlineTaskAlt, MdMenu, MdClose } from "react-icons/md";
import { HiArrowRight } from "react-icons/hi2";

const features = [
  {
    icon: FaBriefcase,
    title: "Projects",
    desc: "Create, track and manage every project from one clean workspace — deadlines, status and clients at a glance.",
  },
  {
    icon: MdOutlineTaskAlt,
    title: "Tasks",
    desc: "Break work down into tasks, assign them to freelancers and track progress in real time.",
  },
  {
    icon: FaFileInvoiceDollar,
    title: "Invoices",
    desc: "Generate invoices per project, track payments and get paid without the back-and-forth.",
  },
  {
    icon: FaUserTie,
    title: "Freelancers & Clients",
    desc: "Discover freelancers, view profiles and skills, and manage every client relationship in one place.",
  },
  {
    icon: FaComments,
    title: "Real-time Chat",
    desc: "Message clients and freelancers instantly with live notifications so nothing slips through the cracks.",
  },
  {
    icon: FaShieldHalved,
    title: "Secure by design",
    desc: "Role-based dashboards for clients and freelancers keep data scoped to exactly who needs it.",
  },
];

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative bg-black text-white min-h-screen overflow-x-hidden">
      {/* Ambient background blobs */}
      <div className="blob w-96 h-96 bg-[#7c6cf6] -top-32 -left-32 animate-float-slow" />
      <div className="blob w-96 h-96 bg-[#22d3ee] top-1/3 -right-40 animate-float-slower" />
      <div className="blob w-72 h-72 bg-[#f6537c] bottom-0 left-1/4 opacity-20" />

      {/* Navbar */}
      <header className="sticky top-0 z-40 glass-panel border-x-0 border-t-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-black">
              w
            </span>
            Workspace
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 rounded-lg text-sm font-medium btn-ghost"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 rounded-lg text-sm font-medium btn-primary"
            >
              Sign up
            </Link>
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-2xl text-white/80"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-2">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-lg text-sm font-medium btn-ghost text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 rounded-lg text-sm font-medium btn-primary text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign up
            </Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs sm:text-sm text-white/70 mb-6">
          <FaBolt className="text-[#22d3ee]" />
          The freelance marketplace built for real work
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-tight mb-6">
          Manage projects, tasks & invoices
          <br className="hidden sm:block" />
          <span className="text-gradient"> all in one place</span>
        </h1>
        <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto mb-10">
          workspace connects clients and freelancers with a single dashboard for
          projects, tasks, invoicing and live chat — no spreadsheets, no missed
          payments.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg btn-primary font-semibold"
          >
            Get started free <HiArrowRight />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg btn-ghost font-semibold"
          >
            I already have an account
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">
            Everything you need, built in
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            One workspace for both sides of the table — clients and freelancers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="glass-card rounded-xl p-6 hover:bg-white/[0.07] transition-colors"
            >
              <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                <Icon className="text-xl text-[#a99cf9]" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="glass-panel rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4">
            Ready to get to work?
          </h2>
          <p className="text-white/50 mb-8">
            Create a free account as a client or freelancer in under a minute.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-7 py-3.5 rounded-lg btn-primary font-semibold"
            >
              Create free account
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3.5 rounded-lg btn-ghost font-semibold"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <span>© {new Date().getFullYear()} Freelo. All rights reserved.</span>
          <div className="flex items-center gap-2 font-display font-bold text-white/70">
            <span className="w-6 h-6 rounded bg-white text-black flex items-center justify-center font-black text-xs">
              w
            </span>
            wrokspace
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
