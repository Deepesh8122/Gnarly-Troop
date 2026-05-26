// src/app/layout.tsx

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./globals.css";

export const metadata = {
  title: "Welcome to My Country, India — Gnarly Troop",
  description: "Gnarly Troop Global Federation — Explore Bharat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700&family=Playfair+Display:wght@600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
