'use client'

import { useRouter } from "next/navigation";

const navItems = [
  {
    label: "Accueil",
    href: "/",
    icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9.02 2.83998L3.63 7.03998C2.73 7.73998 2 9.22998 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.28998 21.19 7.73998 20.2 7.04998L14.02 2.71998C12.62 1.73998 10.37 1.78998 9.02 2.83998Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 17.99V14.99" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>),
  },
  {
    label: "Recherche",
    href: "/recherche",
    icon: (<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
      <path d="M12.25 21C17.4967 21 21.75 16.7467 21.75 11.5C21.75 6.25329 17.4967 2 12.25 2C7.00329 2 2.75 6.25329 2.75 11.5C2.75 16.7467 7.00329 21 12.25 21Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22.75 22L20.75 20" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>),
  },
  {
    label: "Favoris",
    href: "/favoris",
    icon: (<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
      <path d="M13.39 5.88H5.60999C3.89999 5.88 2.5 7.27999 2.5 8.98999V20.35C2.5 21.8 3.54 22.42 4.81 21.71L8.73999 19.52C9.15999 19.29 9.84 19.29 10.25 19.52L14.18 21.71C15.45 22.42 16.49 21.8 16.49 20.35V8.98999C16.5 7.27999 15.1 5.88 13.39 5.88Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16.5 8.98999V20.35C16.5 21.8 15.46 22.41 14.19 21.71L10.26 19.52C9.84001 19.29 9.15999 19.29 8.73999 19.52L4.81 21.71C3.54 22.41 2.5 21.8 2.5 20.35V8.98999C2.5 7.27999 3.89999 5.88 5.60999 5.88H13.39C15.1 5.88 16.5 7.27999 16.5 8.98999Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22.5 5.10999V16.47C22.5 17.92 21.46 18.53 20.19 17.83L16.5 15.77V8.98999C16.5 7.27999 15.1 5.88 13.39 5.88H8.5V5.10999C8.5 3.39999 9.89999 2 11.61 2H19.39C21.1 2 22.5 3.39999 22.5 5.10999Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>),
  },
  {
    label: "Vidéos",
    href: "/videos",
    icon: (<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
      <path d="M12.78 20.42H6.46C3.3 20.42 2.25 18.32 2.25 16.21V7.79002C2.25 4.63002 3.3 3.58002 6.46 3.58002H12.78C15.94 3.58002 16.99 4.63002 16.99 7.79002V16.21C16.99 19.37 15.93 20.42 12.78 20.42Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M19.77 17.1L16.99 15.15V8.84001L19.77 6.89001C21.13 5.94001 22.25 6.52001 22.25 8.19001V15.81C22.25 17.48 21.13 18.06 19.77 17.1Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M11.75 11C12.5784 11 13.25 10.3284 13.25 9.5C13.25 8.67157 12.5784 8 11.75 8C10.9216 8 10.25 8.67157 10.25 9.5C10.25 10.3284 10.9216 11 11.75 11Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>),
  },
  {
    label: "Profil",
    href: "/profil",
    icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26003 15 3.41003 18.13 3.41003 22" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>),
  },
];

export default function BottomNav({ active = "Recherche" }) {
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex items-center h-16 z-50 px-2">
      {navItems.map((item) => {
        const isActive = item.label === active;

        if (item.label === "Recherche" && isActive) {
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className="mx-1 flex items-center space-x-2 bg-blue-600 text-white rounded-full px-4 py-2"
            >
              {item.icon}
              <span className="text-sm font-medium">Recherche</span>
            </button>
          );
        }

        return (
          <button
            key={item.label}
            onClick={() => router.push(item.href)}
            className={`flex-1 flex justify-center items-center h-full ${
              isActive ? "text-blue-600" : "text-gray-400"
            }`}
          >
            {item.icon}
          </button>
        );
      })}
    </nav>
  );
}