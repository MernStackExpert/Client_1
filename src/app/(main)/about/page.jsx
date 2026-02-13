import React from "react";
import { ShieldCheck, Target, Users, Award, Code, Database, Layout, Smartphone, Globe, Zap, CheckCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About Us | SpyMart",
  description: "Discover SpyMart, your premium gateway to high-quality digital learning resources and professional courses.",
};

const AboutPage = () => {
  const stats = [
    { label: "Active Learners", value: "10K+" },
    { label: "Premium Courses", value: "50+" },
    { label: "Expert Creators", value: "15+" },
    { label: "Success Rate", value: "99%" },
  ];

  const features = [
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Global Mission",
      desc: "To empower individuals worldwide by providing access to industry-standard expertise and high-quality resources at an affordable price.",
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Premium Quality",
      desc: "Every resource on our platform is carefully curated and verified by professionals to ensure the highest educational standards.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Dedicated Support",
      desc: "Experience 24/7 assistance through our active community and direct access to resource materials for continuous growth.",
    },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      <section className="relative py-20 bg-base-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
            We are <span className="text-primary">SpyMart</span>
          </h1>
          <p className="text-lg md:text-xl text-base-content/60 max-w-3xl mx-auto leading-relaxed font-medium">
            We believe that quality education and professional resources should be accessible to everyone. Our goal is to provide the perfect guidelines to take your expertise to the next level.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -ml-48 -mb-48"></div>
      </section>

      <section className="py-20 -mt-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-base-100 border border-base-200 p-8 rounded-[2.5rem] shadow-xl text-center hover:border-primary/30 transition-all">
                <div className="text-4xl md:text-5xl font-black text-primary mb-2">{stat.value}</div>
                <div className="text-sm font-bold opacity-40 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, idx) => (
              <div key={idx} className="group">
                <div className="mb-6 p-4 bg-primary/5 w-fit rounded-2xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{feature.title}</h3>
                <p className="text-base-content/70 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-base-200/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="bg-base-100 rounded-[3.5rem] p-8 md:p-16 border border-base-200 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 order-2 md:order-1">
              <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tighter leading-tight">
                Designed for <br /> <span className="text-primary text-2xl md:text-4xl">Modern Learners Everywhere</span>
              </h2>
              <p className="text-base-content/70 mb-8 leading-loose font-medium text-justify">
                SpyMart is more than just a marketplace; it is a premium platform dedicated to connecting ambitious learners with high-quality educational content. We understand the rapidly changing demands of the global market. Whether you are looking for technical mastery or creative skills, our library offers comprehensive materials to ensure your success in any field.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="badge badge-lg bg-base-200 border-none py-6 px-6 rounded-2xl font-bold gap-2 italic">
                    <Zap className="h-5 w-5 text-primary" /> Instant Access
                </div>
                <div className="badge badge-lg bg-base-200 border-none py-6 px-6 rounded-2xl font-bold gap-2 italic">
                    <Globe className="h-5 w-5 text-primary" /> Global Standards
                </div>
                <div className="badge badge-lg bg-base-200 border-none py-6 px-6 rounded-2xl font-bold gap-2 italic">
                    <ShieldCheck className="h-5 w-5 text-primary" /> Verified Content
                </div>
              </div>
            </div>
            <div className="flex-1 order-1 md:order-2">
              <div className="relative">
                <div className="bg-primary/10 absolute inset-0 rounded-[3rem] rotate-3 scale-105"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800" 
                  alt="Students learning together" 
                  className="rounded-[3rem] shadow-2xl relative z-10 transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-primary p-12 rounded-[3rem] text-primary-content">
            <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tighter">Ready to Start?</h2>
            <p className="mb-8 opacity-80 font-medium text-lg">Join thousands of students today and take the first step towards mastering your future.</p>
            <div className="flex justify-center gap-4">
               <Link href={"/courses"} className="btn btn-neutral rounded-2xl px-10 font-black uppercase tracking-widest h-16 shadow-xl">Browse All Courses</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;