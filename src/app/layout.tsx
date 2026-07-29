import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SOLARIS – A Cinematic Journey Through the Solar System",
  description:
    "An immersive, scroll-driven 3D experience through our Solar System. Explore planets, moons, and the Sun in stunning detail.",
  keywords: [
    "solar system",
    "3D",
    "space",
    "planets",
    "interactive",
    "cinematic",
    "NASA",
    "astronomy",
  ],
  openGraph: {
    title: "SOLARIS – Cinematic 3D Solar System",
    description: "An immersive scroll-driven journey through space.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
