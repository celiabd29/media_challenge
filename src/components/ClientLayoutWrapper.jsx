"use client";
import { AuthProvider } from "../contexts/AuthContext";

export default function ClientLayoutWrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
