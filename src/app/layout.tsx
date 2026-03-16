import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Gabriel Glatz — Software Developer",
  description:
    "Desenvolvedor de Software especializado em criar experiências web modernas com React, TypeScript e Node.js.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="grain-overlay" aria-hidden="true" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
