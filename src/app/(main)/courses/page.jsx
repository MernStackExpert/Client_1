import CourseListContent from "@/components/main_home/Courses/CourseListContent";

export const metadata = {
  title: "All Courses | ShakibSchool",
  description: "Browse our extensive collection of professional courses.",
};

const getAllCourses = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/course`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
};

const AllCoursesPage = async () => {
  const courses = await getAllCourses();

  return (
    <div className="min-h-screen bg-base-100 pb-20">
      <div className="bg-primary/5 border-b border-primary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            Explore All <span className="text-primary">Courses</span>
          </h1>
          <p className="text-base-content/60 max-w-2xl mx-auto font-medium">
            All the best courses for your skill development are now in one
            place. Buy today.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <CourseListContent initialCourses={courses} />
      </div>
    </div>
  );
};

export default AllCoursesPage;
