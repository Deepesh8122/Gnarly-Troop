"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// -------------------------------
// ✔ TYPE FOR TIMELINE ITEMS
// -------------------------------
type TimelineItem = {
  year: number;
  country: string;
  city: string;
  details: string;
};

// -------------------------------
// ✔ TIMELINE DATA (WITH TYPE)
// -------------------------------
const timeline: TimelineItem[] = [
  {
    year: 2022,
    country: "IN",
    city: "NEW DELHI",
    details: `<p><strong>2022 | FOUNDATION YEAR &ndash; BUILDING THE TROOP PHILOSOPHY</strong></p>
<p><strong>Location:</strong> New Delhi</p>
<p><strong>Executed Milestones</strong></p>
<ul>
<li>Formal establishment of <strong>Gnarly Troop Global Federation</strong> as a youth-led national platform.</li>
<li>Adoption of the Troop Motto: <em>&ldquo;My Country, My Responsibility, My Pride.&rdquo;</em></li>
<li>Launch of the <strong>4C&rsquo;s Vision</strong>: Climate, Community, Culture, Cooperation.</li>
<li>Organisation of <strong>GT20 Summit</strong> at Ambedkar International Centre, New Delhi.</li>
<li>Presentation of a <strong>successful adopted village model from Bihar</strong>, demonstrating:</li>
<ul>
<li>Rural Development Centre (RDC)</li>
<li>Troop Academic Point</li>
<li>Addiction-free community education</li>
<li>Integrated health and livelihood awareness</li>
</ul>
<li>Creation of <strong>Urban&ndash;Rural Cultural Exchange Hubs</strong> connecting SHGs, artisans, and youth entrepreneurs with urban markets.</li>
</ul>
<p><strong>Leadership Outcome</strong></p>
<ul>
<li>Proof of concept established for scalable rural transformation.</li>
<li>Foundation laid for India-led grassroots diplomacy.</li>
</ul>`,
  },
  {
    year: 2023,
    country: "NP",
    city: "KATHMANDU & NEW DELHI",
    details: `<p><strong>2023 | REGIONAL &amp; INTERNATIONAL EXPANSION</strong></p>
<p><strong>Locations:</strong> Kathmandu | New Delhi</p>
<p><strong>Executed Milestones</strong></p>
<ul>
<li>Launch of <strong>Cultural Exchange &amp; Troop Internship Program</strong> in Nepal, with Kathmandu as the coordination hub.</li>
<li>Cross-border youth engagement focusing on:</li>
<ul>
<li>Culture, volunteering, sustainability</li>
<li>Himalayan ecology and heritage</li>
</ul>
<li>Expansion of Rural Development Centres (pilot phase).</li>
<li>Introduction of <strong>women empowerment and youth skill mapping initiatives</strong>.</li>
</ul>
<p><strong>Leadership Outcome</strong></p>
<ul>
<li>GTGF emerges as a <strong>South Asian youth bridge for cultural diplomacy</strong>.</li>
</ul>
<p>Strengthened people-to-people relations beyond borders.</p>`,
  },
  {
    year: 2024,
    country: "IN",
    city: "NOIDA & JAIPUR",
    details: `<p><strong>2024 | NATIONAL LAUNCH &amp; BRAND INDIA POSITIONING</strong></p>
<p><strong>Locations:</strong> Jaipur | Noida</p>
<p><strong>Executed Milestones</strong></p>
<ul>
<li>Formal launch of <strong>Padharo Mhare Desh Bharat</strong> at Patrika Gate, Jaipur.</li>
<li><strong>Troop Marathon (1 Dec 2024, JLN Marg)</strong> under the mission <em>Clean Air &amp; Blue Skies</em>.</li>
<li>National Summit, Exhibition &amp; Award Ceremony inaugurated by<br /> <strong>Shri Gajendra Singh Shekhawat Ji</strong>, Hon&rsquo;ble Union Minister of Culture &amp; Tourism.</li>
<li>Recognition of grassroots leaders, artisans, educators, climate champions.</li>
<li>Establishment of the <strong>first Troop Model Village prototype</strong>.</li>
</ul>
<p><strong>Leadership Outcome</strong></p>
<ul>
<li>Transition from pilot movement to <strong>national flagship initiative</strong>.</li>
<li>Public&ndash;policy&ndash;citizen convergence achieved.</li>
</ul>`,
  },
  {
    year: 2025,
    country: "IN",
    city: "NEW DELHI & SIKKIM",
    details: `<p><strong>2025 | NATIONAL ALIGNMENT &amp; GLOBAL SOFT POWER</strong></p>
<p><strong>Locations:</strong> New Delhi | Sikkim</p>
<p><strong>Executed &amp; Ongoing Tasks</strong></p>
<ul>
<li>Launch of <strong>Intercultural Exchange, Volunteering Abroad &amp; Explore Bharat Campaigns</strong> under ministerial guidance.</li>
<li>Monthly reviews at <strong>Malaviya Smriti Bhawan, New Delhi</strong>.</li>
<li>Documentation of <strong>Vibrant Bharat</strong>, rural tourism, and SHG success stories.</li>
<li>Empowerment of SHGs through <strong>SARAS Festival (New Delhi &amp; Ludhiana)</strong>.</li>
<li>Recognition for SARAS Festival leadership from the <strong>Punjab Government</strong>.</li>
<li>Strategic identification of <strong>Sikkim</strong> as a Troop Camping &amp; Tourism Icon (from 2026).</li>
</ul>
<p><strong>Leadership Outcome</strong></p>
<ul>
<li>GTGF positioned as a <strong>national knowledge partner for cultural tourism and SHG empowerment</strong>.</li>
</ul>`,
  },
  {
    year: 2026,
    country: "GB",
    city: "LONDON & NEW DELHI",
    details: `<p><strong>2026 | IMPLEMENTATION &amp; MODEL VILLAGE DECLARATION</strong></p>
<p><strong>Locations:</strong> New Delhi | London</p>
<p><strong>Planned Execution</strong></p>
<ul>
<li><strong>Global Leadership Summit &amp; Tourism Excellence Series (2026&ndash;2029)</strong> launched from Bharat Mandapam (21 Feb 2026).</li>
<li><strong>Explore Bharat Leadership Expedition</strong> commencing nationwide.</li>
<li>Declaration of <strong>28 Troop Model Villages in 28 States</strong>.</li>
<li>Launch of:</li>
<ul>
<li>Troop Rural Development Centres</li>
<li>Sustainability Labs</li>
<li>One District &ndash; One Cultural Brand framework</li>
</ul>
</ul>
<p><strong>Leadership Outcome</strong></p>
<ul>
<li>Grassroots development reframed as <strong>national pride and global inspiration</strong>.</li>
</ul>`,
  },
  {
    year: 2027,
    country: "AE",
    city: "DUBAI & NEW DELHI",
    details: `<p><strong>2027 | INTERNATIONAL CULTURAL DIPLOMACY</strong></p>
<p><strong>Locations:</strong> New Delhi | Dubai</p>
<p><strong>Planned Execution</strong></p>
<ul>
<li>International Cultural Exchange Summit with MEA alignment.</li>
<li>Launch of <strong>My Country &ndash; My Pride Global Youth Cohort</strong>.</li>
<li>Expansion of rural tourism, documentation, and storytelling.</li>
</ul>
<p><strong>Leadership Outcome</strong></p>
<p>India positioned as a <strong>citizen-led cultural superpower</strong></p>`,
  },
  {
    year: 2028,
    country: "US",
    city: "CHICAGO & NEW DELHI",
    details: `<p><strong>2028 | CONSOLIDATION &amp; NATIONAL SCALING</strong></p>
<p><strong>Locations:</strong> New Delhi | Chicago</p>
<p><strong>Planned Execution</strong></p>
<ul>
<li>Expansion of Troop Model Village framework to 100+ districts.</li>
<li>Launch of <strong>Digital Troop Youth Leadership Portal</strong>.</li>
<li>National cultural festival showcasing tribal, rural, and youth innovation.</li>
</ul>
<p><strong>Leadership Outcome</strong></p>
<ul>
<li>Cultural economy strengthened as a pillar of development.</li>
</ul>`,
  },
  {
    year: 2029,
    country: "IT",
    city: "ROME & NEW DELHI",
    details: `<p><strong>2029 | ROADMAP TO VIKSIT BHARAT @2047</strong></p>
<p><strong>Locations:</strong> New Delhi | Rome</p>
<p><strong>Strategic Deliverables</strong></p>
<ul>
<li>Submission of <strong>Vibrant Bharat Roadmap</strong> to:</li>
<ul>
<li>Hon&rsquo;ble President of India</li>
<li>National Ministries</li>
<li>NITI Aayog</li>
</ul>
<li>National frameworks on:</li>
<ul>
<li>Citizen participation</li>
<li>Youth leadership</li>
<li>Cultural &amp; tourism transformation</li>
<li>Climate-positive community models</li>
</ul>
</ul>
<p><strong>National Targets</strong></p>
<ul>
<li>1 crore youth engaged</li>
<li>1,000 community clusters empowered</li>
<li>Global recognition of India&rsquo;s civilizational leadership</li>
</ul>`,
  },
];

// -------------------------------
// ✔ MAIN COMPONENT
// -------------------------------
export default function Timeline() {
  const [selected, setSelected] = useState<TimelineItem | null>(null);
  const currentYear = new Date().getFullYear();

  const upcomingEvents = timeline.filter((e) => e.year > currentYear);
  const recentUpcomingYear = upcomingEvents.length
    ? upcomingEvents[0].year
    : null;

  const progressPercent =
    (timeline.filter((e) => e.year <= currentYear).length / timeline.length) *
    100;

  return (
    <section id="sectionTimelines" className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-20 opacity-15">
        <img
          src="/images/world-map-white.png"
          className="w-full h-full object-cover"
        />
      </div>

      <h2 className="text-3xl font-bold text-center mb-10">Global Timeline</h2>

      <div className="relative overflow-x-auto px-6">
        {/* Progress Line */}
        <div className="absolute top-[85px] left-0 right-0 h-[3px] flex">
          <motion.div
            className="h-full bg-gray-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent - 8}%` }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />

          <motion.div
            className="h-full bg-orange-400 flex-1 relative"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 1.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-white"
              style={{ filter: "blur(4px)" }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.div>
        </div>

        {/* Timeline Nodes */}
        <div className="flex justify-between items-start min-w-[1000px] pt-6 pb-10 relative z-10">
          {timeline.map((item, i) => {
            const isPast = item.year < currentYear;
            const isRecentUpcoming = item.year === recentUpcomingYear;
            const isFuture = item.year > currentYear && !isRecentUpcoming;

            const stylePast =
              "opacity-40 text-gray-500 border-gray-400 bg-gray-200";
            const styleRecent =
              "border-[#FF9933] ring-4 ring-[#FF9933]/40 text-[#FF9933] animate-pulse";
            const styleFuture =
              "border-blue-500 ring-2 ring-blue-300 text-blue-500";

            return (
              <div
                key={i}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => setSelected(item)}
              >
                {/* Year */}
                <span
                  className={`text-lg font-semibold mb-2 ${
                    isPast
                      ? "text-gray-500"
                      : isRecentUpcoming
                      ? "text-[#FF9933]"
                      : "text-blue-600"
                  }`}
                >
                  {item.year}
                </span>

                {/* Flag Circle */}
                <motion.div
                  whileHover={{ scale: isPast ? 1 : 1.2 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`w-16 h-16 rounded-full border-2 bg-white shadow flex items-center justify-center relative
                    ${
                      isPast
                        ? stylePast
                        : isRecentUpcoming
                        ? styleRecent
                        : styleFuture
                    }
                  `}
                >
                  {(isRecentUpcoming || isFuture) && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-current pointer-events-none"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}

                  <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                    <span
                      className={`fi fi-${item.country.toLowerCase()} w-full h-full rounded-full`}
                    />
                  </div>
                </motion.div>

                {/* Line connecting dot */}
                <div className="w-px h-6 border-l-2 border-dotted border-gray-400 mt-2 mb-2" />

                {/* Small Dot */}
                <motion.div
                  className={`-mt-1 w-3.5 h-3.5 rounded-full border-4 border-white shadow ${
                    isPast
                      ? "bg-gray-500"
                      : isRecentUpcoming
                      ? "bg-[#FF9933]"
                      : "bg-blue-500"
                  }`}
                  animate={isRecentUpcoming ? { scale: [1, 1.2, 1] } : {}}
                  transition={
                    isRecentUpcoming ? { repeat: Infinity, duration: 1.5 } : {}
                  }
                />

                {/* City Labels */}
                <div className="text-center mt-3">
                  <div
                    className={`font-bold text-sm ${
                      isPast
                        ? "text-gray-500"
                        : isRecentUpcoming
                        ? "text-[#FF9933]"
                        : "text-blue-700"
                    }`}
                  >
                    {item.city.split(" & ")[0]}
                  </div>

                  {item.city.includes("&") && (
                    <div
                      className={`text-sm ${
                        isPast
                          ? "text-gray-400"
                          : isRecentUpcoming
                          ? "text-[#FF9933]/80"
                          : "text-blue-500"
                      }`}
                    >
                      {item.city.split(" & ")[1]}
                    </div>
                  )}

                  {/* Upcoming Label */}
                  {!isPast && (
                    <div
                      className={`mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                        isRecentUpcoming
                          ? "bg-[#FF9933]/20 text-[#FF9933]"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {isRecentUpcoming ? "Next Event" : "Upcoming"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --------------------------------------------- */}
      {/* MODAL POPUP WITH DETAILS */}
      {/* --------------------------------------------- */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto p-4"
            onClick={() => setSelected(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4
             max-h-[85vh] flex flex-col mt-25"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {/* HEADER (no scroll) */}
              <div className="p-6 border-b">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <span
                    className={`fi fi-${selected.country.toLowerCase()}`}
                  ></span>
                  {selected.city}
                </h3>
              </div>

              {/* SCROLLABLE CONTENT */}
              <div
                className="p-6 overflow-y-auto text-gray-600 flex-1"
                dangerouslySetInnerHTML={{ __html: selected.details }}
              />

              {/* FOOTER (no scroll) */}
              <div className="p-6 border-t flex justify-end">
                <button
                  onClick={() => setSelected(null)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
