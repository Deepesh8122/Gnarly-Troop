"use client"; // <<< REQUIRED FOR useState/useEffect in Next.js

import { useState, useRef, useEffect } from "react";
import { Users, Handshake, Globe, Leaf } from "lucide-react";
import { useRouter } from "next/navigation";

type VisionId = "climate" | "community" | "culture" | "cooperation";

interface VisionItem {
  id: VisionId;
  title: string;
  icon: any;
  image: string;
  description: string;
  href: string;
  primaryColor: string;
  secondaryColor: string;
}

interface Coord {
  x: number;
  y: number;
}

export default function SectionVisions() {
  const [activeSection, setActiveSection] = useState<VisionId | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [circleCoords, setCircleCoords] = useState<Coord[]>([]);
  const pipeRefs = useRef<(SVGPathElement | null)[]>([]);

  const router = useRouter();

  const handleRedirectClick = (href: string) => {
    router.push(href);
  };

  // --------------------------
  // Vision Data
  // --------------------------
  const visionData: VisionItem[] = [
    {
      id: "climate",
      title: "CLIMATE",
      icon: Leaf,
      image: "https://www.gnarlytroop.org/padharo/climate.png",
      href: "/4cvision/climate",
      description:
        "Advocating green living, clean air, and ecosystem conservation through eco-tourism and tree plantation.",
      primaryColor: "var(--vision-climate-primary)",
      secondaryColor: "var(--vision-climate-secondary)",
    },
    {
      id: "community",
      title: "COMMUNITY",
      icon: Users,
      image: "https://www.gnarlytroop.org/padharo/community.png",
      href: "/4cvision/community",
      description:
        "Promoting rural empowerment, health, education, and youth development.",
      primaryColor: "var(--vision-community-primary)",
      secondaryColor: "var(--vision-community-secondary)",
    },
    {
      id: "culture",
      title: "CULTURE",
      icon: Globe,
      image: "https://www.gnarlytroop.org/padharo/culture.png",
      href: "/4cvision/culture",
      description:
        "Reviving Indian traditions through arts, crafts, cuisines, festivals, and interfaith dialogue.",
      primaryColor: "var(--vision-culture-primary)",
      secondaryColor: "var(--vision-culture-secondary)",
    },
    {
      id: "cooperation",
      title: "COOPERATION",
      icon: Handshake,
      image: "https://www.gnarlytroop.org/padharo/cooperation.png",
      href: "/4cvision/cooperation",
      description:
        "Strengthening global harmony through multi-cultural exchanges and international partnerships.",
      primaryColor: "var(--vision-cooperation-primary)",
      secondaryColor: "var(--vision-cooperation-secondary)",
    },
  ];

  // --------------------------
  // Click Handler
  // --------------------------
  const handleCircleClick = (id: VisionId) =>
    setActiveSection(activeSection === id ? null : id);

  // --------------------------
  // Get circle positions
  // --------------------------
  const calculateCircleCoords = () => {
    if (!svgRef.current) return;

    const circles = document.querySelectorAll(".circle-btn");
    const parentRect = svgRef.current.getBoundingClientRect();

    const coords = Array.from(circles).map((c) => {
      const rect = c.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - parentRect.left,
        y: rect.top + rect.height / 2 - parentRect.top,
      };
    });

    setCircleCoords(coords);
  };

  useEffect(() => {
    // Small timeout helps on mobile when layout settles slightly later
    const id = setTimeout(() => {
      calculateCircleCoords();
    }, 50);

    window.addEventListener("resize", calculateCircleCoords);
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", calculateCircleCoords);
    };
  }, []);

  // --------------------------
  // Liquid animation (CSS-based, works better on mobile)
  // --------------------------
  useEffect(() => {
    pipeRefs.current.forEach((path) => {
      if (path) {
        const length = path.getTotalLength();
        // Dash pattern proportional to path length
        path.style.strokeDasharray = `${length / 2} ${length / 2}`;
        path.style.strokeDashoffset = "0";
        // Add CSS class for keyframe animation
        path.classList.add("pipe-liquid");
      }
    });
  }, [circleCoords]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  return (
    <div
      id="sectionVisions"
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h4 className="text-2xl md:text-3xl font-bold text-gray-800 border-t-2 border-b-2 border-gray-300 py-4 px-8 inline-block">
            4C&apos;s Vision of Gnarly Troop
          </h4>
        </div>

        {/* Circles + Pipes */}
        <div className="relative flex flex-col lg:flex-row justify-center items-center mb-16">
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
          >
            <defs>
              {/* 3D-like pipe gradient */}
              <linearGradient
                id="pipe3DGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="var(--vision-climate-primary)" />
                <stop offset="50%" stopColor="#A5D6A7" />
                <stop offset="100%" stopColor="var(--vision-climate-primary)" />
              </linearGradient>

              {/* Moving liquid gradient */}
              <linearGradient id="liquidFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#512DA8" />
                <stop offset="50%" stopColor="#B39DDB" />
                <stop offset="100%" stopColor="#512DA8" />
              </linearGradient>
            </defs>

            {/* Draw pipes */}
            {circleCoords.map((coord, i) => {
              if (i === circleCoords.length - 1) return null;

              const next = circleCoords[i + 1];

              const curveHeight = isMobile ? 80 : 120;
              const controlYOffset = curveHeight * (i % 2 === 0 ? -1 : 1);

              const midX = (coord.x + next.x) / 2;

              const pathD = `M${coord.x},${coord.y} C${midX},${
                coord.y + controlYOffset
              } ${midX},${next.y - controlYOffset} ${next.x},${next.y}`;

              return (
                <g key={i}>
                  {/* Pipe outer */}
                  <path
                    d={pathD}
                    stroke="url(#pipe3DGradient)"
                    strokeWidth="16"
                    fill="transparent"
                    strokeLinecap="round"
                    opacity={0.9}
                  />

                  {/* Liquid animated line */}
                  <path
                    ref={(el) => {
                      pipeRefs.current[i] = el;
                    }}
                    d={pathD}
                    stroke="url(#liquidFlow)"
                    strokeWidth="10"
                    fill="transparent"
                    strokeLinecap="round"
                    data-offset="0"
                  />
                </g>
              );
            })}
          </svg>

          {/* Circles */}
          {visionData.map((item) => (
            <div
              key={item.id}
              className="relative z-10 flex justify-center my-4 lg:my-0 lg:flex-1"
            >
              <button
                onClick={() => handleCircleClick(item.id)}
                className="circle-btn relative transition-all duration-500 ease-out group"
              >
                {/* OUTER CIRCLE */}
                <div
                  className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4
          flex items-center justify-center bg-white transition-all duration-500 cursor-pointer
          ${
            activeSection === item.id
              ? "shadow-2xl animate-pulse-slow"
              : "border-dashed border-gray-300 shadow-lg"
          }
          group-hover:scale-105
        `}
                  style={
                    activeSection === item.id
                      ? { borderColor: item.primaryColor }
                      : {}
                  }
                >
                  <div className="text-center">
                    {/* INNER CIRCLE */}
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-2 transition-all duration-500 group-hover:scale-110`}
                      style={{
                        backgroundColor:
                          activeSection === item.id
                            ? item.primaryColor
                            : item.secondaryColor,
                        transform:
                          activeSection === item.id
                            ? "scale(1.10)"
                            : "scale(1)",
                      }}
                    >
                      <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>

                    {/* TITLE TEXT */}
                    <h3
                      className={`text-lg sm:text-xl font-bold transition-colors duration-300`}
                      style={{
                        color:
                          activeSection === item.id
                            ? item.primaryColor
                            : "#1f2937" /* gray-800 */,
                      }}
                    >
                      {item.title.charAt(0) + item.title.slice(1).toLowerCase()}
                    </h3>
                  </div>
                </div>

                {/* PING ANIMATION BORDER */}
                {activeSection === item.id && (
                  <div
                    className="absolute inset-0 rounded-full border-4 animate-ping opacity-75"
                    style={{ borderColor: item.primaryColor }}
                  />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {visionData.map((item) => {
            const isActive = activeSection === item.id;
            const isIdle = activeSection === null;

            return (
              <div
                key={item.title}
                onClick={() => handleRedirectClick(item.href)} // 👈 CARD CLICKABLE
                className={`cursor-pointer bg-white rounded-xl overflow-hidden transition-all duration-500 transform
        ${
          isActive
            ? "scale-105 shadow-2xl"
            : isIdle
              ? "hover:-translate-y-2 hover:shadow-xl hover:scale-[1.03]"
              : "opacity-60 scale-95"
        }
      `}
                style={{
                  boxShadow: isActive
                    ? `0 0 0 2px ${item.primaryColor}`
                    : undefined,
                }}
              >
                {/* Header */}
                <div
                  className="text-white text-center py-3 font-bold text-sm uppercase tracking-wider transition-colors duration-300 border-b"
                  style={{
                    backgroundColor: isActive
                      ? item.primaryColor
                      : item.secondaryColor,
                    borderColor: item.primaryColor,
                  }}
                >
                  {item.title}
                </div>

                {/* Image */}
                <div className="relative h-48 overflow-hidden group">
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-transform duration-700
            ${isActive ? "scale-110" : "scale-100 group-hover:scale-105"}
          `}
                  />
                </div>

                {/* Body */}
                <div className="p-4 bg-gray-50">
                  <p className="text-sm leading-relaxed text-center font-medium text-[#343434]">
                    {item.description}{" "}
                    <a href={item.href} style={{ color: item.primaryColor }}>
                      Know more...
                    </a>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        /* Pipe liquid floating animation (works well on mobile too) */
        @keyframes liquid-flow {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -1000;
          }
        }

        .pipe-liquid {
          animation: liquid-flow 6s linear infinite;
        }
      `}</style>
    </div>
  );
}
