"use client";

import { useState, useRef, useEffect } from "react";
import { Users, Handshake, Globe, Leaf } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./SectionVisionsResponsive.module.css";

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

export default function SectionVisionsResponsive() {
  const [activeSection, setActiveSection] = useState<VisionId | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [circleCoords, setCircleCoords] = useState<Coord[]>([]);
  const pipeRefs = useRef<(SVGPathElement | null)[]>([]);
  const router = useRouter();

  const handleRedirectClick = (href: string) => {
    router.push(href);
  };

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

  const handleCircleClick = (id: VisionId) =>
    setActiveSection(activeSection === id ? null : id);

  const calculateCircleCoords = () => {
    if (!svgRef.current) return;

    const circles = document.querySelectorAll(
      `.${styles.circleBtn}`
    ) as NodeListOf<HTMLElement>;
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
    const id = setTimeout(() => {
      calculateCircleCoords();
    }, 50);

    window.addEventListener("resize", calculateCircleCoords);
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", calculateCircleCoords);
    };
  }, []);

  useEffect(() => {
    pipeRefs.current.forEach((path) => {
      if (path) {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length / 2} ${length / 2}`;
        path.style.strokeDashoffset = "0";
        path.classList.add(styles.pipeLiquid);
      }
    });
  }, [circleCoords]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  return (
    <div id="sectionVisions" className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h4 className={styles.headerTitle}>
            4C&apos;s Vision of Gnarly Troop
          </h4>
        </div>

        {/* Circles + Pipes */}
        <div className={styles.circleRow}>
          <svg ref={svgRef} className={styles.svg}>
            <defs>
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

              <linearGradient id="liquidFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#512DA8" />
                <stop offset="50%" stopColor="#B39DDB" />
                <stop offset="100%" stopColor="#512DA8" />
              </linearGradient>
            </defs>

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
                  <path
                    d={pathD}
                    stroke="url(#pipe3DGradient)"
                    strokeWidth="16"
                    fill="transparent"
                    strokeLinecap="round"
                    opacity={0.9}
                  />
                  <path
                    ref={(el) => {
                      pipeRefs.current[i] = el;
                    }}
                    d={pathD}
                    stroke="url(#liquidFlow)"
                    strokeWidth="10"
                    fill="transparent"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
          </svg>

          {visionData.map((item) => (
            <div key={item.id} className={styles.circleCol}>
              <button
                onClick={() => handleCircleClick(item.id)}
                className={styles.circleBtn}
              >
                <div
                  className={`${styles.outerCircle} ${
                    activeSection === item.id ? styles.outerActive : ""
                  }`}
                  style={
                    activeSection === item.id
                      ? { borderColor: item.primaryColor }
                      : undefined
                  }
                >
                  <div className={styles.circleContent}>
                    <div
                      className={styles.innerCircle}
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
                      <item.icon className={styles.icon} />
                    </div>

                    <h3
                      className={styles.circleTitle}
                      style={{
                        color:
                          activeSection === item.id
                            ? item.primaryColor
                            : "#1f2937",
                      }}
                    >
                      {item.title.charAt(0) + item.title.slice(1).toLowerCase()}
                    </h3>
                  </div>
                </div>

                {activeSection === item.id && (
                  <div
                    className={styles.ping}
                    style={{ borderColor: item.primaryColor }}
                  />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className={styles.cardsGrid}>
          {visionData.map((item) => {
            const isActive = activeSection === item.id;
            const isIdle = activeSection === null;

            return (
              <div
                key={item.title}
                onClick={() => handleRedirectClick(item.href)}
                className={`${styles.card} ${
                  isActive
                    ? styles.cardActive
                    : isIdle
                      ? styles.cardIdle
                      : styles.cardDim
                }`}
                style={{
                  boxShadow: isActive
                    ? `0 0 0 2px ${item.primaryColor}`
                    : undefined,
                }}
              >
                <div
                  className={styles.cardHeader}
                  style={{
                    backgroundColor: isActive
                      ? item.primaryColor
                      : item.secondaryColor,
                    borderColor: item.primaryColor,
                  }}
                >
                  {item.title}
                </div>

                <div className={styles.imageWrap}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`${styles.image} ${
                      isActive ? styles.imageActive : ""
                    }`}
                  />
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.cardText}>
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
    </div>
  );
}
