"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { PlayCircle, ArrowRight } from "lucide-react";

const HeroContent = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-7xl font-black leading-tight text-base-content tracking-tight">
          Unlock Your Potential With{" "}
          <span className="text-primary">ShakibSchool</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-base-content/70 leading-relaxed max-w-xl">
          Learn from industry experts and get access to premium resources. Your
          career transformation starts here with our specialized courses.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/courses"
            className="btn btn-primary btn-lg rounded-full px-8 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105"
          >
            Explore Courses <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-base-200">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
            alt="ShakibSchool Learning Experience"
            className="w-full h-auto"
          />
        </div>
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
      </motion.div>
    </div>
  );
};

export default HeroContent;
