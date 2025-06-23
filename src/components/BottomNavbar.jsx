"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiHome, FiSearch, FiBookmark, FiVideo, FiUser } from "react-icons/fi";
import clsx from "clsx";

const navItems = [
  { name: "Accueil", icon: FiHome, href: "/" },
  { name: "Recherche", icon: FiSearch, href: "/recherche" },
  { name: "Favoris", icon: FiBookmark, href: "/favoris" },
  { name: "Visio", icon: FiVideo, href: "/visio" },
  { name: "Compte", icon: FiUser, href: "/compte" },
];

export default function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex justify-around items-center py-2 shadow-md">
      {navItems.map(({ name, icon: Icon, href }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={name}
            href={href}
            className={clsx(
              "flex flex-col items-center justify-center px-3 py-1 rounded-full transition",
              isActive ? "text-white bg-blue-600" : "text-gray-600"
            )}
          >
            <Icon size={20} />
            <span className="text-xs mt-1">{isActive ? name : ""}</span>
          </Link>
        );
      })}
    </nav>
  );
}
