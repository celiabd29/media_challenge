"use client";

import Link from "next/link";
import Image from "next/image";
import { Bookmark, Share2 } from "lucide-react";

export default function CardFavori({
  type,
  title,
  description,
  image,
  duration = "5min",
  likes = 0,
  href = "#"
}) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex gap-4 p-4">
      {/* Image */}
      <div className="relative w-[100px] h-[100px] rounded-xl overflow-hidden flex-shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        <span className="absolute top-2 left-2 bg-pink-200 text-black text-xs px-2 py-1 rounded-md">
          Écoute
        </span>
      </div>

      {/* Texte */}
      <div className="flex flex-col flex-grow justify-between">
        <div>
          <Link href={href}>
            <h2 className="text-base font-semibold text-black">{title}</h2>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
          </Link>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3 text-gray-500 text-xs">
            <span>⏱ {duration}</span>
            <span>📄 {type}</span>
            <span>❤️ {likes}</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-gray-600 hover:text-gray-800">
              <Bookmark className="w-5 h-5 fill-blue-500 stroke-blue-500" />
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
