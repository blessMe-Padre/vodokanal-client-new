import { Montserrat, Inter, Roboto } from "next/font/google";
import { Suspense } from "react";

import { Footer, Header } from "./components";
import { Metrika } from "./components/Metrika/Metrika";

import type { Metadata } from "next";
import "./globals.css";

import "@/lib/server-init";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "МУП «Находка-Водоканал» - всегда на связи с городом",
  description: "МУП «Находка-Водоканал» - всегда на связи с городом",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${montserrat.variable} ${inter.variable} ${roboto.variable}`}>
          <Suspense>
            <Metrika />
          </Suspense>
        <div className="page_wrapper">
          <Header />
          <main>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
