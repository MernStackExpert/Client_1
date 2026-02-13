import { ShieldCheck, Zap, Globe, Clock } from "lucide-react";

const Services = () => {
  const items = [
    { icon: <ShieldCheck />, title: "Trusted Content", desc: "Curated by experts with verified industry experience." },
    { icon: <Zap />, title: "Instant Access", desc: "Get your drive links immediately after payment approval." },
    { icon: <Globe />, title: "Learn Anywhere", desc: "Responsive platform optimized for mobile and desktop." },
    { icon: <Clock />, title: "Life-time Access", desc: "Pay once and access your course materials forever." }
  ];

  return (
    <section className="py-20 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-base-200/30 border border-base-200 hover:border-primary/30 transition-all hover:shadow-xl group">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-base-content/60 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;