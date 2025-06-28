"use client";
import React from "react";

export default function Popup({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">⏳ Patience !</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
}
