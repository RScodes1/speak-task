
import React from "react";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
      <h1 className="text-2xl font-bold">Task Tracker</h1>
      <nav className="flex gap-4">
        <button className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-700">Home</button>
        <button className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-700">About</button>
      </nav>
    </header>
  );
}
