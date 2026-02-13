import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CourseContent from "./CourseContent.jsx";

const getCourses = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/course`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.slice(0, 12);
  } catch (error) {
    return [];
  }e
};

const Course = async () => {
  const courses = await getCourses();

  return (
    <section id="courses" className="py-20 bg-base-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">Featured Courses</h2>
            <p className="mt-2 text-base-content/60">Choose from our top-rated trending courses</p>
          </div>
          <Link href="/courses" className="btn btn-ghost text-primary font-bold hover:bg-transparent p-0 flex items-center gap-2">
            View All <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        
        <CourseContent courses={courses} />
      </div>
    </section>
  );
};

export default Course;