import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BETTER_AUTH_URL ?? "http://localhost:3000"),
  title: { default: "StudioSpace | Book creative studios by the hour", template: "%s | StudioSpace" },
  description: "Find and book photo studios, sound stages, podcast rooms, music suites and art workshops from fellow creators.",
  openGraph: {
    title: "StudioSpace",
    description: "Find and book creative studios by the hour, or earn from your own space.",
    images: ["/og-image.png"],
  },
};

// Runs before the first paint, so a saved light theme never flashes dark
const themeScript = `(function(){try{var t=localStorage.getItem('studiospace-theme');if(t!=='studio-light'&&t!=='studio-dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'studio-light':'studio-dark'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','studio-dark')}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="studio-dark" suppressHydrationWarning className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-svh flex-col font-sans text-base-content antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
