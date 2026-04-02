import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Udaya | Tamil Lyricist & AI Music",
  description: "Soulful Tamil lyrics and AI music creations by Udaya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <div className="bg-shape shape-1" />
        <div className="bg-shape shape-2" />
        {children}
      </body>
    </html>
  );
}
