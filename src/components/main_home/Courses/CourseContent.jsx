"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, ArrowRight } from "lucide-react";

const CourseContent = ({ courses }) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-20 col-span-full border-2 border-dashed border-base-300 rounded-3xl">
        <p className="text-base-content/50 italic text-lg">No courses found at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
      {courses.map((course, index) => (
        <motion.div
          key={course._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <Link
            href={`/courses/${course._id}`}
            className="group bg-base-100 rounded-2xl md:rounded-3xl overflow-hidden border border-base-200 hover:border-primary/40 transition-all hover:shadow-2xl flex flex-col h-full relative"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={course.course_img}
                alt={course.course_name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute top-2 right-2 bg-base-100/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm z-10">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                {course.course_rating}
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <span className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
                    View Details <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 md:p-6 flex flex-col flex-grow">
              <h3 className="text-sm md:text-xl font-bold line-clamp-2 mb-3 group-hover:text-primary transition-colors duration-300">
                {course.course_name}
              </h3>

              <div className="mt-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-lg md:text-2xl font-black text-primary">
                      ৳{course.course_price}
                    </span>
                  </div>
                  <span className="text-[10px] md:text-xs text-base-content/50 font-medium bg-base-200 px-2 py-1 rounded-md">
                    {course.course_sell}+ Sold
                  </span>
                </div>

                <div className="btn btn-primary btn-sm md:btn-md w-full rounded-xl font-bold gap-2 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                  <ShoppingCart className="h-4 w-4" />
                  Buy Now
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default CourseContent;