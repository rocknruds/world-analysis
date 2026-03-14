import type { Metadata } from "next";
import { Geologica } from "next/font/google";
import "./globals.css";
import Masthead from "@/components/Masthead";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const geologica = Geologica({
  subsets: ["latin"],
  variable: "--font-geologica",
  weight: ["300", "400", "500", "600", "700"],
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
    <html lang="en" className={geologica.variable} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen">
        <ThemeProvider>
          <Masthead />
          <main className="relative z-10">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}