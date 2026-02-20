"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Home,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logOut, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "admin") {
        router.push("/user-blust");
      }
    }
  }, [user, loading, router]);

  const menuItems = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Manage Num",
      href: "/dashboard/manage_num",
      icon: <CreditCard size={20} />,
    },
    {
      name: "Manage Payments",
      href: "/dashboard/manage-payment",
      icon: <CreditCard size={20} />,
    },
    {
      name: "Manage Courses",
      href: "/dashboard/manage-course",
      icon: <BookOpen size={20} />,
    },
    { name: "Users List", href: "/dashboard/users", icon: <Users size={20} /> },
    {
      name: "Archive Payments",
      href: "/dashboard/archive-payment",
      icon: <Settings size={20} />,
    },
  ];

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="font-black uppercase tracking-widest text-xs opacity-50">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex overflow-hidden">
      <aside className="hidden lg:flex flex-col w-72 bg-base-200 border-r border-base-300 p-6">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
            <ShieldCheck className="text-primary-content h-6 w-6" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">
            Spy<span className="text-primary">Mart</span>
          </span>
        </div>

        <nav className="flex-grow space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                pathname === item.href
                  ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
                  : "hover:bg-base-300 opacity-60 hover:opacity-100"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-base-300">
          <button
            onClick={() => logOut()}
            className="flex items-center gap-4 px-4 py-3.5 w-full rounded-2xl font-bold text-error hover:bg-error/10 transition-all cursor-pointer"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100] lg:hidden backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-base-100 z-[110] lg:hidden p-6 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <span className="text-xl font-black tracking-tighter uppercase">
                  ShakibSchool
                </span>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="btn btn-ghost btn-circle btn-sm"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold ${
                      pathname === item.href
                        ? "bg-primary text-primary-content"
                        : "hover:bg-base-200"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="h-20 bg-base-100 border-b border-base-300 flex items-center justify-between px-6 sticky top-0 z-[50]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="btn btn-ghost btn-circle lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex bg-base-200 rounded-full px-4 py-2 border border-base-300 items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-xs font-bold text-success uppercase tracking-widest">
                Admin Secured
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/"
              className="btn btn-ghost btn-sm md:btn-md rounded-xl gap-2 font-bold opacity-70 hover:opacity-100 hover:bg-primary/10 hover:text-primary transition-all mr-2"
            >
              <Home size={18} />
              <span className="hidden sm:inline uppercase text-xs tracking-tighter">
                Portal Home
              </span>
            </Link>

            <div className="flex items-center gap-3 pl-4 border-l border-base-300">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black truncate max-w-[120px]">
                  {user?.name}
                </p>
                <p className="text-[10px] uppercase font-bold text-primary tracking-widest">
                  {user?.role}
                </p>
              </div>
              <img
                src={user?.img || "/default-avatar.png"}
                className="h-10 w-10 rounded-xl object-cover border-2 border-primary/20"
                alt="Profile"
              />
            </div>
          </div>
        </header>

        <main className="flex-grow relative">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
