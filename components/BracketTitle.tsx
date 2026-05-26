"use client";
import { motion } from "framer-motion";

export default function BracketTitle({ text }: { text: string }) {
  return (
    <div className="relative inline-block">
      {/* Left Bracket */}
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute left-0 top-1/2 -translate-y-1/2 origin-right text-5xl font-bold text-yellow-400"
      >
        [
      </motion.span>

      {/* Text */}
      <span className="px-8 text-5xl font-bold inline-block text-white">
        {text}
      </span>

      {/* Right Bracket */}
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 origin-left text-5xl font-bold text-yellow-400"
      >
        ]
      </motion.span>
    </div>
  );
}
