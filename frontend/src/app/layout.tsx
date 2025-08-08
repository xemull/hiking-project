import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from 'next/script'
import { GA_MEASUREMENT_ID } from '../lib/gtag'
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
  verification: {
    google: "lJvEw4tdD_Oc8BGnec_hhfhGD0bCebMaSoUUTPHALF8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}