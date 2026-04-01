import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AgileForum 2026 | Global Agile & Business Transformation Conference",
  description:
    "AgileForum 2026 is set to ignite a business transformation wave across the world. Join us for expert keynotes, immersive sessions, and exclusive networking.",
  keywords: [
    "agile",
    "forum",
    "business transformation",
    "scrum",
    "conference",
    "2026",
    "organizational excellence",
  ],
  openGraph: {
    title: "AgileForum 2026",
    description:
      "The premier Agile Forum dedicated to Organizational Transformation",
    type: "website",
    url: "https://agileforum.org",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${publicSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
