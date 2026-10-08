import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "appli poker",
  description: "Training poker preflop — charts GTO, académie, drill, hand history",
};

// Script inline pour appliquer le thème avant le render et éviter le FOUC
const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('appli_poker_theme');
    if (theme === 'light') document.documentElement.classList.add('light');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href={`${base}/manifest.webmanifest`} />
        <link rel="apple-touch-icon" href={`${base}/apple-touch-icon.png`} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="fixed top-3 right-3 z-50">
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
