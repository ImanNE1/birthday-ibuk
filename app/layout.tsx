import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

// 1. Mengambil Font dari Google
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: '--font-playfair', // Variabel untuk Tailwind
  display: 'swap',
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter', // Variabel untuk Tailwind
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Selamat Ulang Tahun Ibu",
  description: "Didedikasikan untuk wanita terhebat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      {/* 2. Menerapkan Font Variable ke Body */}
      <body className={`${playfair.variable} ${inter.variable} bg-cream text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}