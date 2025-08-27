import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SmartTrip – Explore the World's Wonders",
  description:
    "Plan smarter, travel better. AI-powered trip planner with real-time budget and personalized itineraries.",
  icons: {
    icon: "/favicon.ico", // ✅ from /public
  },
  openGraph: {
    type: "website",
    url: "https://getsmarttrip.com",
    title: "SmartTrip – AI Travel Planner",
    description:
      "Plan smarter, travel better. AI-powered trip planner with real-time budget and personalized itineraries.",
    images: [
      {
        url: "https://getsmarttrip.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SmartTrip – AI Travel Planner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartTrip – AI Travel Planner",
    description:
      "Plan smarter, travel better. AI-powered trip planner with real-time budget and personalized itineraries.",
    images: ["https://getsmarttrip.com/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Fallback favicon */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-[#F9F9F9] text-[#333]`}
      >
        {children}
      </body>
    </html>
  );
}
