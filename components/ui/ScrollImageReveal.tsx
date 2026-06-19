"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

type Props = {
  src: string;
  alt?: string;
  shellClassName?: string;
  imageClassName?: string;
  direction?: "left" | "right";
};

/** Image-only scroll reveal: shell clips 8px radius; image slides + parallax on scroll. */
export default function ScrollImageReveal({
  src,
  alt = "",
  shellClassName,
  imageClassName,
  direction = "left",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px", amount: 0.35 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);
  const slideFrom = direction === "left" ? -72 : 72;

  return (
    <div ref={ref} className={shellClassName}>
      <motion.img
        src={src}
        alt={alt}
        className={imageClassName}
        loading="lazy"
        decoding="async"
        style={{ y: inView ? imgY : 0 }}
        initial={{ opacity: 0, x: slideFrom, scale: 1.08 }}
        animate={
          inView
            ? { opacity: 1, x: 0, scale: 1 }
            : { opacity: 0, x: slideFrom, scale: 1.08 }
        }
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
