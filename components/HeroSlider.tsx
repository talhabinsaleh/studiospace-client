"use client";

import Link from "next/link";
import { Autoplay, EffectFade, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const SLIDES = [
  {
    image: "/photos/control-suite.jpg",
    alt: "Music control room with a mixing desk, studio monitors and acoustic panels",
    frame: "Frame 01 / Sound",
    title: "Your next record needs a better room than your bedroom.",
    text: "Rent a tuned control suite or a live room by the hour from engineers who built them for their own work.",
  },
  {
    image: "/photos/green-screen.jpg",
    alt: "Film crew setting up cameras in front of a bright green screen",
    frame: "Frame 02 / Film",
    title: "Roll on a real stage without renting it for a month.",
    text: "Green screens and crew-ready floors, with the hourly rate and deposit printed before you ask.",
  },
  {
    image: "/photos/round-table.jpg",
    alt: "Podcast microphones on boom arms around a round table",
    frame: "Frame 03 / Voice",
    title: "Sit down, swing the mic over and start talking.",
    text: "Podcast rooms where the sound is treated and the gear is checked before you get there.",
  },
];

export default function HeroSlider() {
  return (
    <section aria-label="Featured spaces" className="border-b border-base-300">
      <Swiper
        modules={[Autoplay, EffectFade, Keyboard, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        keyboard
        autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        className="[--swiper-pagination-bottom:12px]"
      >
        {SLIDES.map((slide, index) => (
          <SwiperSlide key={slide.frame} className="!bg-base-100">
            <div className="page-shell grid items-center gap-8 pb-14 pt-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12 lg:py-12">
              <div className="order-2 lg:order-1">
                <p className="eyebrow">{slide.frame}</p>
                {index === 0 ? (
                  <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl xl:text-6xl">{slide.title}</h1>
                ) : (
                  <h2 className="text-4xl font-bold leading-[1.05] sm:text-5xl xl:text-6xl">{slide.title}</h2>
                )}
                <p className="section-text text-lg">{slide.text}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
                  <Link href="/studios" className="btn btn-outline">Host Your Space</Link>
                </div>
              </div>
              <div className="order-1 overflow-hidden rounded-box lg:order-2">
                <div className="sprockets" aria-hidden="true" />
                <div className="film-frame">
                  <img src={slide.image} alt={slide.alt} className="aspect-[3/2] w-full object-cover" loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : undefined} />
                </div>
                <div className="sprockets" aria-hidden="true" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
