import { useState, useEffect } from "react";
import { ecommerceService } from "@/services/ecommerceService";

interface Slide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

export function useCarrousel() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    ecommerceService.getBanners().then((data) => {
      setSlides(
        data.map((b: any) => ({
          id: b._id,
          image: b.image,
          title: b.title,
          subtitle: b.subtitle ?? "",
        }))
      );
    });
  }, []);

  const goNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const goPrev = () => {
    setDirection(1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  return { slides, current, direction, goNext, goPrev, goTo };
}
