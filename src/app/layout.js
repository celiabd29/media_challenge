// app/layout.js
import "./globals.css";
import ClientLayoutWrapper from "../components/ClientLayoutWrapper";
import BottomNavbar from "../components/BottomNavbar";

export const metadata = {
  title: "Osmose",
  description: "Application média éducative et sécurisée",
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff0000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111827" />
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
