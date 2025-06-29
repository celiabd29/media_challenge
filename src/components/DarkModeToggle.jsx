'use client';

import { useDarkMode } from '@/contexts/DarkModeContext';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle() {
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <div className="w-full mb-6 flex items-center justify-between">
      <span className="text-sm font-medium">Mode sombre</span>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`relative w-16 h-9 flex items-center rounded-full p-1 transition-colors duration-300 shadow-inner ${
          darkMode ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <div
          className={`absolute left-1 flex items-center justify-center w-7 h-7 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
            darkMode ? 'translate-x-7' : 'translate-x-0'
          }`}
        >
          {darkMode ? (
            <Moon className="text-blue-600" size={16} />
          ) : (
            <Sun className="text-yellow-500" size={16} />
          )}
        </div>
      </button>
    </div>
  );
}
