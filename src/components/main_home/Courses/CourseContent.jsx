import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";

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
      {courses.map((course) => (
        <div 
          key={course._id} 
          className="group bg-base-100 rounded-2xl md:rounded-3xl overflow-hidden border border-base-200 hover:border-primary/30 transition-all hover:shadow-2xl flex flex-col"
        >
          <div className="relative aspect-video overflow-hidden">
            <img 
              src={course.course_img} 
              alt={course.course_name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-2 right-2 bg-base-100/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              {course.course_rating}
            </div>
          </div>

          <div className="p-3 md:p-6 flex flex-col flex-grow">
            <h3 className="text-sm md:text-xl font-bold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {course.course_name}
            </h3>
            
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg md:text-2xl font-black text-primary">৳{course.course_price}</span>
                <span className="text-[10px] md:text-xs text-base-content/50 font-medium">
                  {course.course_sell}+ Sold
                </span>
              </div>

              <Link 
                href={`/courses/${course._id}`}
                className="btn btn-primary btn-sm md:btn-md w-full rounded-xl font-bold gap-2"
              >
                <ShoppingCart className="h-4 w-4 hidden md:block" />
                Enroll Now
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseContent;