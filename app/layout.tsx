import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation/Navigation";
import { CompareProvider } from "@/lib/context/CompareContext";
import { CompareBar } from "@/components/spots/CompareBar";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Outsy — Open it. Pick a spot. Go out.",
  description: "Curated outing spots in Lagos. No endless scrolling. Find the vibe, price, and location fast.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} min-h-full flex flex-col font-sans antialiased`} data-theme="light">
        <CompareProvider>
          <Navigation />
          <main className="flex-1 pb-24 md:pb-0">
            <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-6">
              {children}
            </div>
          </main>
          <CompareBar />
        </CompareProvider>
      </body>
    </html>
  );
}
