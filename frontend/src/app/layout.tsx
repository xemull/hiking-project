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
       <link rel="dns-prefetch" href="//www.googletagmanager.com" />   
       {/* Preconnect to image hosts to speed up LCP */}
       <link rel="preconnect" href="https://cms-service-623946599151.europe-west2.run.app" crossOrigin="" />
       <link rel="preconnect" href="https://storage.googleapis.com" crossOrigin="" />

      </head>      
      <body className={`${inter.className} antialiased`}>
        {/* Google Analytics – defer to reduce TBT */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            const initGA = () => {
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true, transport_type: 'beacon' });
            };
            if ('requestIdleCallback' in window) {
              // @ts-ignore
              window.requestIdleCallback(initGA);
            } else {
              setTimeout(initGA, 0);
            }
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
