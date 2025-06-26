"use client";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "../../components/Dashboard";
import NavButton from "../../components/BottomNavbar";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return <p>Chargement...</p>;

  return (
    <>
      <Dashboard />
      <NavButton />
    </>
  );
}
