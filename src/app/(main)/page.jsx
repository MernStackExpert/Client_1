import Course from "@/components/main_home/Courses/Courses";
import Hero from "@/components/main_home/Hero/Hero";
import Ratings from "@/components/main_home/Ratings/Ratings";
import Services from "@/components/main_home/Services/Services";

export const metadata = {
  title: "ShakibSchool - Master Your Skills with Professional Courses",
  description:
    "Join ShakibSchool to access high-quality courses with expert mentors. Start your learning journey today.",
  openGraph: {
    title: "ShakibSchool | Professional LMS",
    description: "Premium course selling platform for modern learners.",
    images: ["/og-image.jpg"],
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Course />
      <Services />
      <Ratings />
    </div>
  );
}
