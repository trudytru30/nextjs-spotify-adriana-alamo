"use client";

import { useState } from "react";

function PopularityWidget({ onChange }) {
  const [popularity, setPopularity] = useState(70); // 0-100

  const handleChange = (event) => {
    const value = Number(event.target.value);
    setPopularity(value);
    if (onChange) {
      onChange(value);
    }
  };

  const labelForPopularity = (value) => {
    if (value < 30) return "Deep cuts";
    if (value < 60) return "Hidden gems";
    return "Stadium anthems";
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-400/60 bg-gradient-to-br from-[#87CEEB] via-[#4A9FD8] to-[#2E7BA8] p-4 shadow-[0_0_50px_rgba(56,189,248,0.8)]">
      {/* 1989 TV - Cielo azul vibrante con gaviotas y nubes */}
      
      {/* Gaviotas estilizadas */}
      <div className="pointer-events-none absolute top-8 right-12 text-white/30">
        <svg width="24" height="16" viewBox="0 0 24 16" fill="currentColor">
          <path d="M12 0C10 2 8 4 6 4C4 4 2 2 0 0C2 2 4 4 6 6C8 8 10 10 12 10C14 10 16 8 18 6C20 4 22 2 24 0C22 2 20 4 18 4C16 4 14 2 12 0Z" />
        </svg>
      </div>
      <div className="pointer-events-none absolute top-16 right-24 text-white/20" style={{transform: 'scale(0.8)'}}>
        <svg width="24" height="16" viewBox="0 0 24 16" fill="currentColor">
          <path d="M12 0C10 2 8 4 6 4C4 4 2 2 0 0C2 2 4 4 6 6C8 8 10 10 12 10C14 10 16 8 18 6C20 4 22 2 24 0C22 2 20 4 18 4C16 4 14 2 12 0Z" />
        </svg>
      </div>
      
      {/* Nubes suaves */}
      <div className="pointer-events-none absolute top-4 left-8 h-16 w-32 rounded-full bg-white/20 blur-xl" />
      <div className="pointer-events-none absolute top-12 left-24 h-12 w-24 rounded-full bg-white/15 blur-lg" />
      <div className="pointer-events-none absolute bottom-8 right-8 h-20 w-40 rounded-full bg-white/10 blur-2xl" />
      
      {/* Brillo del sol */}
      <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.4),_transparent_70%)] blur-2xl" />
      
      {/* Destellos de luz */}
      <div className="pointer-events-none absolute top-6 right-20 h-1 w-1 rounded-full bg-white/80 animate-pulse" />
      <div className="pointer-events-none absolute top-20 right-16 h-0.5 w-0.5 rounded-full bg-white/60 animate-pulse" style={{animationDelay: '0.5s'}} />
      <div className="pointer-events-none absolute bottom-16 left-16 h-1 w-1 rounded-full bg-white/80 animate-pulse" style={{animationDelay: '1s'}} />

      <div className="relative space-y-4">
        {/* Encabezado 1989 TV */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 bg-white/95 px-3 py-1.5 backdrop-blur-sm shadow-lg">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-sky-400 to-pink-400 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-sky-600">
                1989 (Taylor's Version)
              </p>
            </div>
            <h3 className="text-sm font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
              De secretos a himnos de estadio
            </h3>
            <p className="text-[11px] text-white/95 leading-relaxed drop-shadow-sm font-medium">
              Como el skyline de Nueva York: controla si brillan como luces de rascacielos 
              o permanecen como secretos guardados. Bienvenido a la ciudad que nunca duerme.
            </p>
          </div>

          <div className="rounded-xl border-2 border-white/70 bg-white/95 px-3 py-2.5 text-right backdrop-blur-sm shadow-xl">
            <p className="text-[9px] uppercase tracking-[0.24em] text-sky-600 font-bold">
              Level
            </p>
            <p className="text-2xl font-black text-transparent bg-gradient-to-r from-sky-500 to-pink-500 bg-clip-text">
              {popularity}
            </p>
            <p className="text-[9px] font-bold text-sky-700">
              {labelForPopularity(popularity)}
            </p>
          </div>
        </div>

        {/* Slider estilo 1989 TV - más vibrante y moderno */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] text-white font-bold drop-shadow-md">
            <span className="uppercase tracking-[0.22em]">
              0 - Deep Cuts
            </span>
            <span className="uppercase tracking-[0.22em]">
              100 - Stadium
            </span>
          </div>

          <div className="relative">
            {/* Barra con degradado vibrante 1989 TV */}
            <div className="h-2.5 w-full rounded-full bg-white/40 backdrop-blur-sm overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-400 via-sky-400 to-blue-500 shadow-[0_0_20px_rgba(56,189,248,0.8)] transition-all duration-300"
                style={{ width: `${popularity}%` }}
              />
            </div>

            {/* Indicador estilo moderno con sombra */}
            <div
              className="pointer-events-none absolute -top-10 flex -translate-x-1/2 flex-col items-center transition-all duration-300"
              style={{ left: `${popularity}%` }}
            >
              <div className="rounded-lg bg-white px-3 py-2 shadow-[0_8px_16px_rgba(0,0,0,0.25)] border-2 border-sky-300">
                <div className="text-[13px] font-black text-transparent bg-gradient-to-r from-sky-500 to-pink-500 bg-clip-text">
                  {popularity}
                </div>
              </div>
              <div className="mt-1 h-0 w-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-white drop-shadow-md" />
            </div>

            {/* Input range invisible */}
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={popularity}
              onChange={handleChange}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
        </div>

        {/* Descripción con estilo 1989 TV */}
        <div className="rounded-xl border-2 border-white/50 bg-white/90 px-4 py-3 backdrop-blur-md shadow-lg">
          <p className="font-black text-sky-600 text-[12px] uppercase tracking-wide">
            {labelForPopularity(popularity)}
          </p>
          <p className="text-[10px] text-slate-700 mt-1.5 leading-relaxed font-medium">
            Este nivel determina qué tan conocidas serán las canciones. 
            Como Nueva York: desde joyas ocultas en callejones hasta 
            luces brillantes del Times Square.
          </p>
        </div>

        {/* Footer con referencias a 1989 TV */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-[9px] text-white/70 font-bold uppercase tracking-wider drop-shadow-sm">
            New York City
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
            <div className="h-1.5 w-1.5 rounded-full bg-pink-300 shadow-[0_0_6px_rgba(236,72,153,0.8)]" />
            <div className="h-1.5 w-1.5 rounded-full bg-blue-300 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
          </div>
          <div className="text-[9px] text-white/70 font-bold uppercase tracking-wider drop-shadow-sm">
            Welcome to NY
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopularityWidget;