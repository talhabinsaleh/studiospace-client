"use client";

import Link from "next/link";
import { Autoplay, EffectFade, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920&q=80&auto=format&fit=crop",
    alt: "Recording studio control room with a mixing desk and a wall of guitars",
    label: "Take 01 / Music",
    title: "Book the room your record deserves.",
    text: "Tracking rooms, control suites and writing spaces, available by the hour from musicians who love them.",
  },
  {
    image: "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=1920&q=80&auto=format&fit=crop",
    alt: "White photography cyc wall with softboxes and strobes",
    label: "Take 02 / Photo",
    title: "Your next campaign starts on a clean white wall.",
    text: "Cyc walls and blackbox rooms with lights already rigged. See every rate and deposit before you book.",
  },
  {
    image: "https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=1920&q=80&auto=format&fit=crop",
    alt: "Two people recording a podcast at a table with microphones",
    label: "Take 03 / Podcast",
    title: "Hit record minutes after you walk in.",
    text: "Podcast rooms with mics, cameras and lighting set up, so your guests get your attention instead of the gear.",
  },
];

export default function HeroSlider() {
  return (
    <section aria-label="Featured spaces">
      <Swiper
        modules={[Autoplay, EffectFade, Keyboard, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        keyboard
        autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        className="h-[min(82svh,720px)] min-h-[520px]"
      >
        {SLIDES.map((slide, index) => (
          <SwiperSlide key={slide.label}>
            <div className="relative h-full bg-black">
              <img src={slide.image} alt={slide.alt} className="absolute inset-0 size-full object-cover" loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : undefined} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10 sm:bg-gradient-to-r sm:from-black/90 sm:via-black/55 sm:to-transparent" />
              <div className="page-shell relative flex h-full items-end pb-16 sm:items-center sm:pb-0">
                <div className="max-w-2xl text-white">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#ff8a63]">{slide.label}</p>
                  {index === 0 ? (
                    <h1 className="mt-4 text-4xl font-bold leading-[1.05] sm:text-6xl">{slide.title}</h1>
                  ) : (
                    <h2 className="mt-4 text-4xl font-bold leading-[1.05] sm:text-6xl">{slide.title}</h2>
                  )}
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">{slide.text}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
                    <Link href="/studios" className="btn btn-outline border-white text-white hover:bg-white hover:text-black">Host Your Space</Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
