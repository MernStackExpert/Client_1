"use client";
import { Star, Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Ratings = () => {
  const reviews = [
    {
      id: 1,
      name: "Nirob Sarkar",
      role: "MERN Developer",
      text: "ShakibSchool has the best courses. The drive link system is amazing!",
      rating: 5,
    },
    {
      id: 2,
      name: "Anika Rahman",
      role: "Graphic Designer",
      text: "Very helpful content and expert mentors. Highly recommended.",
      rating: 5,
    },
    {
      id: 3,
      name: "Sakib Al Hasan",
      role: "Web Learner",
      text: "The payment process was smooth and instant access is great.",
      rating: 4,
    },
    {
      id: 4,
      name: "Mehedi Hasan",
      role: "UI/UX Designer",
      text: "High quality video and well structured course modules.",
      rating: 5,
    },
    {
      id: 5,
      name: "Tanvir Ahmed",
      role: "Backend Developer",
      text: "The support is great and the community is very active.",
      rating: 5,
    },
    {
      id: 6,
      name: "Sadiya Islam",
      role: "Full Stack Learner",
      text: "I learned a lot within a very short time. Best investment.",
      rating: 5,
    },
    {
      id: 7,
      name: "Rashed Khan",
      role: "App Developer",
      text: "Clean and easy to understand explanations. Loved it!",
      rating: 4,
    },
    {
      id: 8,
      name: "Jannat Tara",
      role: "Frontend Dev",
      text: "Professional courses with real world projects. 10/10!",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-primary text-primary-content overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16">
          <div className="max-w-md text-center lg:text-left">
            <h2 className="text-4xl font-black mb-4">
              Trusted by 10k+ Students Worldwide
            </h2>
            <p className="opacity-80">
              Our courses are rated 4.9/5 by our active learners from different
              industries.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 shrink-0">
            <div className="text-center">
              <div className="text-5xl font-black">4.9</div>
              <div className="flex justify-center mt-2 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} fill="currentColor" className="h-5 w-5" />
                ))}
              </div>
              <p className="mt-2 font-medium opacity-70">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black">99%</div>
              <div className="mt-2 text-2xl">🔥</div>
              <p className="mt-2 font-medium opacity-70">Success Rate</p>
            </div>
          </div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="ratings-swiper !pb-14"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="bg-base-100 p-8 rounded-3xl h-full flex flex-col justify-between border border-white/10 hover:shadow-2xl transition-all group">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-1 text-yellow-500">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} fill="currentColor" className="h-4 w-4" />
                      ))}
                    </div>
                    <Quote className="text-primary/20 h-8 w-8 rotate-180" />
                  </div>
                  <p className="text-base-content/80 text-sm leading-relaxed mb-6 italic">
                    "{review.text}"
                  </p>
                </div>
                <div className="flex items-center gap-4 border-t border-base-200 pt-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {review.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-base-content">
                      {review.name}
                    </h4>
                    <p className="text-xs text-base-content/50">
                      {review.role}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Ratings;
