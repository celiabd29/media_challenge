"use client";

import React from "react";
import Link from "next/link";

export default function FavorisCard({ item }) {
  const linkHref =
    item.type === "Article"
      ? `/articles/${item.id}`
      : item.type === "Vidéo"
      ? `/video/${item.id}`
      : item.type === "Podcast"
      ? `/podcast/${item.id}`
      : "#";

  return (
    <Link href={linkHref}>
      <div className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition">
        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.title || item.titre}
            className="w-full h-44 object-cover rounded-md mb-2"
          />
        )}
        <h3 className="text-lg font-semibold mb-1">
          {item.title || item.titre}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {item.description || item.content?.slice(0, 100) + "..."}
        </p>
        <div className="mt-2 text-sm text-blue-600">{item.type}</div>
      </div>
    </Link>
  );
}
