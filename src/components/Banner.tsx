import React, { useState, useEffect, SyntheticEvent } from "react";
import Slider, { Settings } from "react-slick";
import ProductSlider from "./ProductSlider";
import Link from "next/link";
import { Link2 } from "lucide-react";
import supabase from "@/supabase/config";
import ProductSliderSM from "./ProductSliderSM";
import { getAllSlides } from "@/supabase/getAllSlides";
import toast from "react-hot-toast";


interface BannerProps { }

const Banner: React.FC<BannerProps> = () => {
  const [dotActive, setDotActive] = useState<number>(0);
  const [slides, setSlides] = useState<any[]>([]);

  const settings: Settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 7000, // Autoplay speed of 3 seconds
    pauseOnHover: true, // Pause autoplay on hover
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    speed: 1000,
    // adaptiveHeight: true, 
    beforeChange: (prev: number, next: number) => {
      setDotActive(next);
    },
    appendDots: (dots: any) => (
      <div
        style={{
          top: "80%",
          left: "67%",
          userSelect: 'none'
        }}
        className="absolute translate-x[-50%] translate-y[-50%]"
      >
        <ul
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 3,
            userSelect: 'all'
          }}
          className="justify-center"
        >
          {dots}
        </ul>
      </div>
    ),
    customPaging: (i: number) => (
      <div
        className={`${i === dotActive ? 'bg-designColor w-6 h-2 ' : "w-2 h-2 border border-zinc-400"} rounded-full cursor-pointer`}
      >
        <span className="hidden md:flex items-center gap-1">

        </span>
      </div>
    ),
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllSlides(); // Await the promise resolution
        return data;
      } catch (error) {
        console.error("Error fetching products:", error);
        return []; // Return an empty array if there's an error
      }
    };

    if (typeof window !== "undefined") {
      fetchProducts().then(data => {
        setSlides(data);
      });
    }
  }, []); // Removed slides from dependency array to prevent infinite loop


  return (
    <div className="relative flex flex-col lg:flex-row gap-3 lg:mt-2 lg:p-5 bg-white">
      <div className="lg:w-[70%] overflow-hidden  rounded-lg ">
        <Slider {...settings}>
          {slides && slides.map((slide, index) => (
            <div
              key={slide?.id}
              className={`${dotActive === index ? "z-10" : "z-0"
                } relative`}
            >
              <div className="w-full flex-col flex items-start justify-center h-full">
                <img
                  src={slide?.image || "https://via.placeholder.com/800x400"}
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://makeplaceholder.com?text=Broken+Url&size=800x400&tcolor=333333"; // Set placeholder image on error
                  }}
                  alt={`Slide ${index}`}
                  className="object-contain w-full border border-designColor/40 overflow-hidden"
                />

                <Link href={slide?.link_url || '#'} className="my-2">
                  <button className="flex items-center gap-1 justify-center hover:underline font-bold py-1 px-2 ">
                    <Link2 size={17} /><span className="text-xs">more info... </span>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <div className="lg:block lg:w-[28%]">
        <ProductSlider />
        <ProductSliderSM />
      </div>
    </div>
  );
};

export default Banner;
