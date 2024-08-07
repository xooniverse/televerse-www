import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Televerse | Your gateway to seamless Telegram bot development!",
  authors: [
    {
      name: "Xooniverse",
      url: "https://xooniverse.com"
    }
  ],
  description: "A powerful Telegram Bot API Framework built with Dart",
  keywords: "Televerse, Telegram bot, Dart, Telegram API, bot framework, Xooniverse",
  icons: "https://televerse.xooniverse.com/assets/logo.png",
  openGraph: {
    title: "Televerse",
    description: "A powerful, easy-to-use, and highly customizable Telegram bot framework built with Dart language.",
    images: [
      {
        url: "https://televerse.xooniverse.com/assets/lockup-with-bg.png",
        width: 1200,
        height: 630,
      }
    ],
    url: "https://github.com/Xooniverse/televerse",
    type: "website",
    siteName: "Televerse",
  },
  twitter: {
    card: "summary_large_image",
    title: "Televerse",
    description: "A powerful, easy-to-use, and highly customizable Telegram bot framework built with Dart language.",
    images: [
      "https://televerse.xooniverse.com/assets/lockup-with-bg.png",
    ],
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://televerse.xooniverse.com",
    languages: {
      "en": "https://televerse.xooniverse.com/en",
      "es": "https://televerse.xooniverse.com/es",
    }
  },
  publisher: "Xooniverse",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
