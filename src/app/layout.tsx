import type { Metadata } from "next";
import localFont from "next/font/local";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Masthead from "@/components/Masthead";

const funnelSans = localFont({
  src: [
    {
      path: "../../fonts/Funnel_Sans/FunnelSans-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../../fonts/Funnel_Sans/FunnelSans-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-funnel",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PowerFlow",
    template: "%s · PowerFlow",
  },
  description:
    "We don't analyze what governments claim. We analyze where power actually moves.",
  applicationName: "PowerFlow",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${funnelSans.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-[#0a0a0a] text-white min-h-screen">
        <Masthead />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
