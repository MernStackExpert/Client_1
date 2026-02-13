"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  Star,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const CourseListContent = ({ initialCourses }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const filteredCourses = useMemo(() => {
    let result = initialCourses.filter((course) =>
      course.course_name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (sortBy === "price-low")
      result.sort((a, b) => a.course_price - b.course_price);
    if (sortBy === "price-high")
      result.sort((a, b) => b.course_price - a.course_price);
    if (sortBy === "rating")
      result.sort((a, b) => b.course_rating - a.course_rating);

    return result;
  }, [searchQuery, sortBy, initialCourses]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-base-200 p-4 rounded-3xl border border-base-300">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-base-content/40" />
          <input
            type="text"
            placeholder="Search courses..."
            className="input input-bordered w-full pl-12 rounded-2xl bg-base-100 border-none focus:ring-2 ring-primary/20 font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <SlidersHorizontal className="h-5 w-5 text-primary hidden md:block" />
          <select
            className="select select-bordered w-full md:w-48 rounded-2xl font-bold bg-base-100 border-none"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course, idx) => (
            <motion.div
              key={course._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Link
                href={`/courses/${course._id}`}
                className="group bg-base-100 rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-base-200 hover:border-primary/40 transition-all hover:shadow-2xl flex flex-col h-full relative"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={course.course_img}
                    alt={course.course_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 bg-base-100/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm z-10">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    {course.course_rating}
                  </div>
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white text-primary p-3 rounded-full shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <ArrowRight className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-7 flex flex-col flex-grow">
                  <h3 className="text-sm md:text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300 truncate">
                    {course.course_name}
                  </h3>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">
                          Price
                        </span>
                        <span className="text-xl md:text-3xl font-black text-primary leading-none">
                          ৳{course.course_price}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] md:text-xs font-black bg-primary/10 text-primary px-3 py-1.5 rounded-lg">
                          {course.course_sell}+ SOLD
                        </span>
                      </div>
                    </div>

                    <div className="btn btn-primary btn-sm md:btn-md w-full rounded-2xl font-black gap-2 shadow-lg shadow-primary/20">
                      <ShoppingCart className="h-4 w-4" />
                      Buy Now
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 border-2 border-dashed border-base-300 rounded-[3.5rem] bg-base-200/30"
        >
          <div className="flex flex-col items-center gap-4">
            <Search className="h-12 w-12 opacity-10" />
            <p className="text-2xl font-black opacity-20 uppercase tracking-[0.3em]">
              No Courses Found
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSortBy("latest");
              }}
              className="btn btn-ghost btn-sm text-primary font-bold"
            >
              Clear all filters
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CourseListContent;
