import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import AIWidget from "@/components/ui/AIWidget";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SURE Forensics | Audit your Supplier in 10 Minutes",
  description: "Protect your capital. Forensic Artificial Intelligence to detect fraud, legally analyze contracts, and validate technical discrepancies in B2B supply chains.",
  keywords: "due diligence, supplier fraud, importers, forensic artificial intelligence, validate invoices, international contracts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      translate="no"
      className={`${montserrat.variable} ${openSans.variable} h-full antialiased dark`}
    >
      <head>
        <meta name="google" content="notranslate" />
        {/* Placeholder: Telemetry Tag (Google Analytics / Pixel) */}
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          {children}
          <AIWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}
