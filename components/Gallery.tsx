"use client";

import { Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import StudioImage from "./StudioImage";

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  return (
    <Swiper modules={[Keyboard, Navigation, Pagination]} navigation={images.length > 1} pagination={{ clickable: true }} keyboard loop={images.length > 1} className="aspect-[16/10] overflow-hidden rounded-box bg-base-300 [--swiper-navigation-color:#fff] [--swiper-navigation-size:26px]">
      {images.map((image, index) => (
        <SwiperSlide key={`${image}-${index}`}>
          <StudioImage src={image} alt={`${title}, photo ${index + 1} of ${images.length}`} priority={index === 0} className="size-full object-cover" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
