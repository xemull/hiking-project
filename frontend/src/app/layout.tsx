import type { Metadata } from "next";
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
export const viewport = {
  width: 'device-width',
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
    <html lang="en" className={`${inter.variable} light`}>
      <head>
        <meta name="color-scheme" content="light" />
       <link rel="dns-prefetch" href="//fonts.googleapis.com" />
       <link rel="dns-prefetch" href="//fonts.gstatic.com" />
       <link rel="dns-prefetch" href="//www.googletagmanager.com" />   
        {/* Preload critical Inter font weights */}
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfAZ9hiA.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
    rel="preload"
    href="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
    as="font"
    type="font/woff2"
    crossOrigin=""
  />
  <link
    rel="preload"
    href="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfAZ9hiA.woff2"
    as="font"
    type="font/woff2"
    crossOrigin=""
  />
  
  {/* Preload critical hero background image - NEW */}
  <link
    rel="preload"
    href="/IMG_1682.webp"
    as="image"
    type="image/webp"
  />  
      </head>      
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
