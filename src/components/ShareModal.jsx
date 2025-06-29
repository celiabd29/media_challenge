'use client';

import { useEffect, useState } from 'react';

export default function ShareModal({ onClose }) {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const [isSharing, setIsSharing] = useState(false);

  const shareOptions = [
    {
      label: 'Copier le lien',
      icon: '/icons/copy.png',
      action: () => {
        navigator.clipboard.writeText(url);
        alert('Lien copié !');
        onClose();
      }
    },
    {
      label: 'WhatsApp',
      icon: '/icons/whatsapp.png',
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank')
    },
    {
      label: 'Facebook',
      icon: '/icons/facebook.png',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
    },
    {
      label: 'Twitter',
      icon: '/icons/twitter.png',
      action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, '_blank')
    },
    {
      label: 'Instagram',
      icon: '/icons/instagram.png',
      action: async () => {
        if (!navigator.share) {
          alert("Le partage natif n'est pas disponible sur cet appareil.");
          return;
        }

        if (isSharing) return; // 🔒 évite les doubles clics

        setIsSharing(true);
        try {
          await navigator.share({
            title: document.title,
            text: "Regarde ce contenu 👀",
            url: url,
          });
          onClose(); // ferme le modal si le partage réussit
        } catch (error) {
          console.error('Erreur de partage', error);
        } finally {
          setIsSharing(false);
        }
      }
    },
    {
      label: 'Message',
      icon: '/icons/imessage.png',
      action: () => window.open(`sms:?body=${encodeURIComponent(url)}`)
    }
  ];

  // Fermer avec ESC
  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Partagez</h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {shareOptions.map((opt, i) => (
            <button
              key={i}
              onClick={opt.action}
              className="flex flex-col items-center text-center text-sm text-gray-800 hover:opacity-80 transition"
            >
              <img src={opt.icon} alt={opt.label} className="w-10 h-10 rounded-lg mb-1" />
              {opt.label}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-500 text-white text-center py-3 rounded-xl font-medium hover:bg-blue-600 transition"
        >
          J’ai compris
        </button>
      </div>
    </div>
  );
}
