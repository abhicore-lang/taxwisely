import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const GA_MEASUREMENT_ID = "GA_MEASUREMENT_ID"; // Replace with your GA4 Measurement ID

export const metadata: Metadata = {
  metadataBase: new URL("https://taxwisely.in"),
  title: {
    default: "TaxWisely — Free Tax Calculator for Salaried Indians",
    template: "%s | TaxWisely",
  },
  description:
    "Calculate HRA exemption, compare new vs old tax regime, and understand your salary. Free tools for salaried Indians. Based on Budget 2025-26.",
  keywords: [
    "HRA calculator",
    "tax regime calculator",
    "salary calculator",
    "income tax calculator India",
    "new vs old regime 2025",
    "payslip explainer",
    "rent receipt PDF",
  ],
  authors: [{ name: "TaxWisely" }],
  creator: "TaxWisely",
  publisher: "TaxWisely",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://taxwisely.in",
    siteName: "TaxWisely",
    title: "TaxWisely — Free Tax Calculator for Salaried Indians",
    description:
      "Calculate HRA exemption, compare new vs old tax regime, and understand your salary. Free tools for salaried Indians.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TaxWisely — Free Tax Tools for Salaried Indians",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TaxWisely — Free Tax Calculator for Salaried Indians",
    description:
      "Calculate HRA exemption, compare new vs old tax regime, and understand your salary.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics 4 */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${sora.variable} font-sans bg-background text-text-primary min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
