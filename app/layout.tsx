import type { Metadata } from "next";
import {
  Archivo_Black,
  Barlow_Condensed,
  Black_Ops_One,
  Geist_Mono,
  Oswald,
} from "next/font/google";
import "./globals.css";

const appSans = Barlow_Condensed({
  variable: "--font-app-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tabDisplay = Oswald({
  variable: "--font-tab-display",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const display = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const wordmark = Black_Ops_One({
  variable: "--font-wordmark",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Stick 'n Track",
  description: "Presentation-inspired demo prototype for Stick 'n Track",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${appSans.variable} ${geistMono.variable} ${tabDisplay.variable} ${display.variable} ${wordmark.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
