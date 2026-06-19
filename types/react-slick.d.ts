declare module "react-slick" {
  import type { ComponentType, ReactNode, Ref } from "react";

  export interface Settings {
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    autoplay?: boolean;
    autoplaySpeed?: number;
    pauseOnHover?: boolean;
    pauseOnFocus?: boolean;
    arrows?: boolean;
    responsive?: Array<{
      breakpoint: number;
      settings: Settings | "unslick";
    }>;
  }

  export interface SliderMethods {
    slickPrev: () => void;
    slickNext: () => void;
  }

  const Slider: ComponentType<
    Settings & { ref?: Ref<SliderMethods>; children?: ReactNode }
  >;
  export default Slider;
}
