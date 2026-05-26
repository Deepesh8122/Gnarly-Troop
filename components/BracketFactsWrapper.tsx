"use client";

import { motion, useInView, useAnimation } from "framer-motion";
import { useRef, useEffect, ReactNode } from "react";

interface WrapperProps {
  children: ReactNode;
}

export default function BracketFactsWrapper({ children }: WrapperProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const leftControls = useAnimation();
  const rightControls = useAnimation();
  const contentControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      leftControls.start({
        scaleY: 1,
        transition: { duration: 0.9, ease: "easeOut" },
      });

      rightControls.start({
        scaleY: 1,
        transition: { duration: 0.9, ease: "easeOut", delay: 0.15 },
      });

      contentControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut", delay: 0.3 },
      });
    }
  }, [isInView]);

  return (
    <div
      ref={ref}
      className="relative bg-[#faf8f2] py-20 px-6 md:px-20 rounded-xl overflow-hidden"
    >
      {/* LEFT BRACKET */}
      <motion.div
        animate={leftControls}
        initial={{ scaleY: 0 }}
        className="absolute left-0 top-1/2 -translate-y-1/2 h-[80%] w-10 bg-yellow-400 rounded-r-3xl origin-center"
        style={{ borderTopRightRadius: "60px", borderBottomRightRadius: "60px" }}
      />

      {/* RIGHT BRACKET */}
      <motion.div
        animate={rightControls}
        initial={{ scaleY: 0 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 h-[80%] w-10 bg-yellow-400 rounded-l-3xl origin-center"
        style={{ borderTopLeftRadius: "60px", borderBottomLeftRadius: "60px" }}
      />

      {/* INNER CONTENT */}
      <motion.div
        animate={contentControls}
        initial={{ opacity: 0, y: 40 }}
        className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-16 text-center"
      >
        {children}
      </motion.div>
    </div>
  );
}
