import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Literata,
  Manrope,
} from "next/font/google";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const bodyFont = Literata({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const sansFont = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Edith Södergran – biografi online",
  description:
    "En boknära webbplats för att läsa en biografi om Edith Södergran online och ladda ned boken i PDF-format.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${sansFont.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
