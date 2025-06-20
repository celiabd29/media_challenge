import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";

export const metadata = {
  title: "Mon App Média",
  description: "Application média éducative et sécurisée",
  manifest: "/manifest.json",
  themeColor: "#111827",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* Ajout du manifest PWA */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="theme-color" content="#111827" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
