import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://udaya-music.vercel.app"
  ),
  title: "Udaya | AI Music Creator & Tamil Lyricist",
  description:
    "Soulful Tamil lyrics, emotional melodies, and futuristic AI music creations by Udaya.",
  keywords: [
    "Udaya",
    "Tamil Lyricist",
    "AI Music Creator",
    "Tamil Songs",
    "Independent Tamil Music",
    "Tamil AI Music",
  ],
  authors: [{ name: "Udaya" }],
  creator: "Udaya",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Udaya Music Portfolio",
    title: "Udaya | AI Music Creator & Tamil Lyricist",
    description:
      "Soulful Tamil lyrics, emotional melodies, and futuristic AI music creations by Udaya.",
    images: [
      {
        url: "/profile.png",
        width: 1200,
        height: 630,
        alt: "Udaya - AI Music Creator & Tamil Lyricist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Udaya | AI Music Creator & Tamil Lyricist",
    description:
      "Soulful Tamil lyrics and futuristic AI music creations by Udaya.",
    images: ["/profile.png"],
    creator: "@udaya",
  },
  icons: {
    icon: "/profile.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth bg-black">
      <body className={`${inter.variable} ${outfit.variable} antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
