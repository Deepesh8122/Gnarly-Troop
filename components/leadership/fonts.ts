import { Noto_Sans, Noto_Serif } from "next/font/google";

export const gatesSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
  variable: "--gates-font-sans-loaded",
  adjustFontFallback: false,
});

export const gatesSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--gates-font-serif-loaded",
  adjustFontFallback: false,
});

/** Applies Noto Sans/Serif and overrides site-wide Rajdhani on leadership routes */
export const gatesFontClassName = `${gatesSans.className} ${gatesSerif.className} ${gatesSans.variable} ${gatesSerif.variable}`;
