"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, User, ShieldCheck, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="flex items-center gap-2.5 group transition-all"
              aria-label="SpyMart Home"
            >
              <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-primary-content h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-base-content">
                SPY<span className="text-primary">MART</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1 font-semibold text-base-content/80">
              <Link href="/" className="px-4 py-2 hover:text-primary transition-colors">Home</Link>
              <Link href="/courses" className="px-4 py-2 hover:text-primary transition-colors">All Courses</Link>
              <Link href="/about" className="px-4 py-2 hover:text-primary transition-colors">About Us</Link>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center">
              <button className="btn btn-ghost btn-circle hover:bg-base-200">
                <Search className="h-5 w-5" />
              </button>
            </div>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle hover:bg-base-200">
                <div className="indicator">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="badge badge-sm badge-primary indicator-item font-bold">0</span>
                </div>
              </div>
            </div>

            <Link 
              href="/login" 
              className="hidden sm:flex btn btn-primary rounded-full px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
            >
              Login
            </Link>

            <button 
              className="btn btn-ghost btn-circle lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-base-100 border-t border-base-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <Link 
                href="/" 
                className="block px-4 py-3 text-lg font-semibold hover:bg-base-200 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/courses" 
                className="block px-4 py-3 text-lg font-semibold hover:bg-base-200 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                All Courses
              </Link>
              <Link 
                href="/about" 
                className="block px-4 py-3 text-lg font-semibold hover:bg-base-200 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About Us
              </Link>
              <div className="pt-4 px-4">
                <Link 
                  href="/login" 
                  className="btn btn-primary w-full rounded-xl font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;