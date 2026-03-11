import type { Metadata } from "next";
import {
  Archivo_Black,
  Barlow_Condensed,
  Geist_Mono,
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

const display = Archivo_Black({
  variable: "--font-display",
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
        className={`${appSans.variable} ${geistMono.variable} ${display.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
