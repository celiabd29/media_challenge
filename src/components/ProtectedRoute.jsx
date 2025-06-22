// components/ProtectedRoute.jsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children, roleRequired }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      if (error || !data || data.role !== roleRequired) {
        router.push("/login");
        return;
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [roleRequired, router]);

  if (!isAuthorized) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  return children;
}
