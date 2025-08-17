import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Petro Web",
  description: "Petrolimex",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
      <link rel="preload" href="/backgrounds/screen_01.png" as="image" fetchpriority="high" />
      <link rel="preload" href="/backgrounds/screen_02.png" as="image" fetchpriority="high" />
      <link rel="preload" href="/backgrounds/screen_03.png" as="image" fetchpriority="high" />
      <link rel="preload" href="/backgrounds/screen_04.png" as="image" fetchpriority="high" />
    </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
