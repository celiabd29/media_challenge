"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { supabase } from "../supabase/supabaseClient";
import { useDarkMode } from "../contexts/DarkModeContext";

// Icônes
function HomeIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.02 2.84L3.63 7.04C2.73 7.74 2 9.23 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29 21.19 7.74 20.2 7.05L14.02 2.72C12.62 1.74 10.37 1.79 9.02 2.84Z" />
      <path d="M12 17.99V14.99" />
    </svg>
  );
}

function SearchIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 25 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12.25" cy="11.5" r="7" />
      <path d="M22.75 22L20.75 20" />
    </svg>
  );
}

function BookmarkIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.39 5.88H5.61C3.9 5.88 2.5 7.28 2.5 8.99V20.35C2.5 21.8 3.54 22.42 4.81 21.71L8.74 19.52C9.16 19.29 9.84 19.29 10.25 19.52L14.18 21.71C15.45 22.42 16.49 21.8 16.49 20.35V8.99C16.5 7.28 15.1 5.88 13.39 5.88Z" />
      <path d="M16.5 8.99V20.35C16.5 21.8 15.46 22.41 14.19 21.71L10.26 19.52C9.84 19.29 9.16 19.29 8.74 19.52L4.81 21.71C3.54 22.41 2.5 21.8 2.5 20.35V8.99C2.5 7.28 3.9 5.88 5.61 5.88H13.39C15.1 5.88 16.5 7.28 16.5 8.99Z" />
      <path d="M22.5 5.11V16.47C22.5 17.92 21.46 18.53 20.19 17.83L16.5 15.77V8.99C16.5 7.28 15.1 5.88 13.39 5.88H8.5V5.11C8.5 3.4 9.9 2 11.61 2H19.39C21.1 2 22.5 3.4 22.5 5.11Z" />
    </svg>
  );
}

function VideoIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 25 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.78 20.42H6.46C3.3 20.42 2.25 18.32 2.25 16.21V7.79C2.25 4.63 3.3 3.58 6.46 3.58H12.78C15.94 3.58 16.99 4.63 16.99 7.79V16.21C16.99 19.37 15.93 20.42 12.78 20.42Z" />
      <path d="M19.77 17.1L16.99 15.15V8.84L19.77 6.89C21.13 5.94 22.25 6.52 22.25 8.19V15.81C22.25 17.48 21.13 18.06 19.77 17.1Z" />
      <path d="M11.75 11C12.578 11 13.25 10.328 13.25 9.5C13.25 8.672 12.578 8 11.75 8C10.922 8 10.25 8.672 10.25 9.5C10.25 10.328 10.922 11 11.75 11Z" />
    </svg>
  );
}

function AccountIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="5" />
      <path d="M4 21v-1a7 7 0 0 1 14 0v1" />
    </svg>
  );
}

export default function BottomNavbar() {
  const pathname = usePathname();
  const [compteHref, setCompteHref] = useState("/login");
  const { darkMode } = useDarkMode();

  useEffect(() => {
    const fetchRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) return setCompteHref("/login");

      const { data } = await supabase.from("users").select("role").eq("id", userId).maybeSingle();

      if (data?.role === "admin") setCompteHref("/dashboard");
      else if (data?.role === "sexologue") setCompteHref("/espace-pro");
      else if (data?.role === "utilisateur") setCompteHref("/profil");
      else setCompteHref("/login");
    };

    fetchRole();
  }, [pathname]);

  const navItems = [
    { name: "Accueil", icon: HomeIcon, href: "/" },
    { name: "Recherche", icon: SearchIcon, href: "/recherche" },
    { name: "Favoris", icon: BookmarkIcon, href: "/favoris" },
    { name: "Visio", icon: VideoIcon, href: "/visio" },
    { name: "Compte", icon: AccountIcon, href: compteHref },
  ];

  return (
    <nav className={clsx(
      "fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center py-3 shadow-2xl px-4 sm:px-12 lg:px-32",
      "rounded-tl-2xl rounded-tr-2xl border-t",
      darkMode ? "bg-[#0F172A] text-white border-slate-700" : "bg-white text-gray-700 border-gray-200"
    )}>
      {navItems.map(({ name, icon: Icon, href }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={name}
            href={href}
            className={clsx(
              "flex items-center justify-center px-3 py-1 rounded-full transition",
              isActive ? "text-white bg-blue-600" : darkMode ? "text-gray-300 hover:bg-slate-800" : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <Icon size={20} color={isActive ? "white" : "currentColor"} />
            {isActive && (
              <span className="text-sm font-medium ml-2 hidden md:inline">{name}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
