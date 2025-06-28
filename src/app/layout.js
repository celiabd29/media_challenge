// app/layout.js
import "./globals.css";
import ClientLayoutWrapper from "../components/ClientLayoutWrapper";
import BottomNavbar from "../components/BottomNavbar";

export const metadata = {
  title: "Osmose",
  description: "Application média éducative et sécurisée",
  manifest: "/manifest.json", // utilisé par next-pwa
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111827",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Couleurs */}
        <meta name="theme-color" content="#111827" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Osmose" />
        <meta name="apple-mobile-web-app-title" content="Osmose" />

        {/* Icônes Favicon + Apple */}
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />

        {/* Icônes PWA Android */}
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon/web-app-manifest-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon/web-app-manifest-512x512.png" />
      </head>
      <body suppressHydrationWarning={true}>
        <ClientLayoutWrapper>
          {children}
          {/* <BottomNavbar /> */}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
