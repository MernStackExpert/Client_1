"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, User, ShieldCheck, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logOut } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Courses", href: "/courses" },
    { name: "About Us", href: "/about" },
  ];

  return (
    <nav className="w-full bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group transition-all">
              <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-primary-content h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-base-content uppercase">
                SPY<span className="text-primary">MART</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1 font-semibold text-base-content/80">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    pathname === link.href 
                    ? "bg-primary/10 text-primary" 
                    : "hover:text-primary hover:bg-base-200"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => logOut()}
                  className="hidden sm:flex btn btn-ghost btn-circle text-error hover:bg-error/10 transition-all"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
                
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className={`relative h-10 w-10 rounded-full overflow-hidden cursor-pointer border-2 transition-all active:scale-95 ${
                    pathname.startsWith("/dashboard") ? "border-primary ring-2 ring-primary/20" : "border-primary/20 hover:border-primary"
                  }`}
                >
                  <img src={user.img || "/default-avatar.png"} alt="Profile" className="h-full w-full object-cover" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className={`hidden sm:flex btn rounded-full px-8 font-bold shadow-lg transition-all ${
                  pathname === "/login" ? "btn-primary shadow-primary/40" : "btn-primary shadow-primary/20 hover:shadow-primary/40"
                }`}
              >
                Login
              </Link>
            )}

            <button className="btn btn-ghost btn-circle lg:hidden" onClick={() => setIsOpen(!isOpen)}>
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
            className="lg:hidden bg-base-100 border-t border-base-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 text-lg font-semibold rounded-xl ${
                    pathname === link.href ? "bg-primary text-primary-content" : "hover:bg-base-200"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {!user ? (
                <div className="pt-4 px-4">
                  <Link href="/login" onClick={() => setIsOpen(false)} className="btn btn-primary w-full rounded-xl font-bold uppercase tracking-widest">Login</Link>
                </div>
              ) : (
                <div className="pt-4 px-4">
                   <button 
                    onClick={() => { logOut(); setIsOpen(false); }} 
                    className="btn btn-error btn-outline w-full rounded-xl font-bold gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-base-100 z-[70] shadow-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black uppercase tracking-tighter">Account</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="btn btn-ghost btn-circle btn-sm">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col items-center text-center mb-10 p-6 bg-base-200 rounded-[2.5rem] border border-base-300/50">
                <img src={user?.img} className="h-20 w-20 rounded-full border-4 border-primary mb-4 shadow-xl" alt="Avatar" />
                <h3 className="font-black text-lg truncate w-full">{user?.name}</h3>
                <p className="text-[10px] opacity-50 font-black uppercase tracking-[0.2em] bg-base-300 px-3 py-1 rounded-full mt-1">
                  {user?.role}
                </p>
              </div>

              <div className="space-y-2 flex-grow">
                <Link
                  href={user?.role === "admin" ? "/dashboard/admin" : "/dashboard/user"}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-bold group ${
                    pathname.startsWith("/dashboard") ? "bg-primary text-primary-content shadow-lg shadow-primary/20" : "hover:bg-primary/10"
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" /> My Dashboard
                </Link>
              </div>

              <button
                onClick={() => { logOut(); setIsSidebarOpen(false); }}
                className="flex items-center gap-4 p-4 text-error hover:bg-error hover:text-error-content rounded-2xl transition-all font-bold group border border-error/20"
              >
                <LogOut className="h-5 w-5" /> Logout Account
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;