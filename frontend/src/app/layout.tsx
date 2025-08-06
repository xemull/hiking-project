import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Use Inter as your main font (since that's what your design system uses)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Separate viewport export (fixes the warning)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Trailhead - Your Digital Hiking Guide",
  description: "Comprehensive, vetted guides for multi-day treks. Your trusted digital cicerone for planning epic hiking adventures.",
  keywords: ["hiking", "trekking", "multi-day hikes", "trail guides", "outdoor adventure"],
  authors: [{ name: "Stan" }],
  // Remove viewport from here - it's now in the separate viewport export above
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      {/* Remove the manual head section - Next.js handles font loading automatically */}
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}