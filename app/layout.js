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
  title: "SmartTrip",
  description: "AI-powered personalized travel planner",
  icons: {
    icon: "/favicon.ico", // ✅ Favicon from /public folder
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" /> {/* ✅ fallback in case metadata doesn’t render */}
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-[#F9F9F9] text-[#333]`}
      >
        {children}
      </body>
    </html>
  );
}
