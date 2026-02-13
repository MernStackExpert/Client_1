import HeroContent from "./HeroContent";

const Hero = () => {
  return (
    <section className="relative w-full bg-base-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <HeroContent />
      </div>
    </section>
  );
};

export default Hero;