import { Star, ShieldCheck, Clock, Globe, ShoppingCart, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const getSingleCourse = async (id) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/course?id=${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
};

export async function generateMetadata({ params }) {
  const { id } = await params;
  const course = await getSingleCourse(id);
  if (!course) return { title: "Course Not Found" };

  return {
    title: `${course.course_name} | SpyMart`,
    description: course.course_description,
  };
}

const CourseDetails = async ({ params }) => {
  const { id } = await params;
  const course = await getSingleCourse(id);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="bg-base-200 py-12 md:py-20 border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold mb-4">
                <span className="badge badge-primary badge-outline px-4 py-3">Featured Course</span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary" /> {course.course_rating} Rating
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                {course.course_name}
              </h1>
              <p className="mt-6 text-lg text-base-content/70 max-w-xl leading-relaxed">
                {course.course_description}
              </p>
              <div className="mt-8 flex flex-wrap gap-6 text-sm font-semibold opacity-80">
                <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> Lifetime Access</div>
                <div className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> 100% Online</div>
                <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Certified Course</div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-base-100 ring-1 ring-base-300">
                <img 
                  src={course.course_img} 
                  alt={course.course_name} 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-black mb-6">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex gap-3 items-start p-4 rounded-2xl bg-base-200/50">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                    <span className="font-medium text-base-content/80">Comprehensive module on advanced industry techniques.</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10">
              <h3 className="text-2xl font-bold mb-4">Course Description</h3>
              <p className="text-base-content/70 leading-loose">
                {course.course_description} This course is designed to take you from a beginner level to an advanced professional. You will work on real-world projects and get hands-on experience that employers are looking for.
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-base-100 border border-base-200 rounded-3xl p-8 shadow-xl shadow-base-300/50">
              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl font-black text-primary">৳{course.course_price}</span>
                <span className="text-base-content/50 line-through mb-1">৳{course.course_price + 1000}</span>
              </div>
              
              <div className="space-y-4">
                <Link 
                  href={`/checkout/${course._id}`}
                  className="btn btn-primary btn-lg w-full rounded-2xl font-black text-lg gap-3"
                >
                  <ShoppingCart className="h-6 w-6" /> Buy Now
                </Link>
                <p className="text-center text-xs text-base-content/50 font-medium uppercase tracking-widest">
                  Secure Payment with Bkash/Nagad
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-base-200">
                <h4 className="font-bold mb-4">This course includes:</h4>
                <ul className="space-y-3 text-sm font-medium text-base-content/70">
                  <li className="flex items-center gap-3">✓ Full lifetime access</li>
                  <li className="flex items-center gap-3">✓ Access on mobile and TV</li>
                  <li className="flex items-center gap-3">✓ Certificate of completion</li>
                  <li className="flex items-center gap-3">✓ 24/7 Mentor support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;