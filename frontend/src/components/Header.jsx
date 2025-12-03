import React from "react";

export default function Header() {
  return (
    <header
      className="
        flex justify-between items-center 
        px-6 py-4 mb-4 
        rounded-xl 
        bg-[#111213] 
        border border-white/10 
        shadow-[0_0_20px_rgba(0,0,0,0.4)] 
      "
    >
      {/* Logo + Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-wide text-white">
          Speak Task
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex gap-2">
        {["Home", "About"].map((item) => (
          <button
            key={item}
            className="
              px-4 py-2 
              text-sm font-medium
              rounded-lg
              text-white/80 
              bg-white/5 
              border border-white/10
              hover:text-white 
              hover:bg-white/10 
              hover:border-white/20 
              transition-all duration-200
              active:scale-95
            "
          >
            {item}
          </button>
        ))}
      </nav>
    </header>
  );
}
