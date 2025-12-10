"use client";

import { useState } from "react";

/**
 * Configuración de moods:
 * Cada mood define un perfil de audioFeatures para filtrar/ponderar luego
 * en la generación de la playlist (valence, energy, danceability, tempo, etc.).
 */
const MOODS = [
  {
    key: "chill",
    name: "Chill",
    description: "Suave, relajado, más acústico y con poca energía.",
    audioFeatures: {
      valenceRange: [0.4, 0.8],
      energyRange: [0.1, 0.5],
      danceabilityRange: [0.2, 0.6],
      tempoRange: [60, 105],
      acousticnessRange: [0.4, 1.0],
      instrumentalnessRange: [0.0, 0.8],
    },
  },
  {
    key: "happy",
    name: "Happy",
    description: "Optimista, bailable, con energía positiva.",
    audioFeatures: {
      valenceRange: [0.7, 1.0],
      energyRange: [0.6, 1.0],
      danceabilityRange: [0.6, 1.0],
      tempoRange: [100, 140],
      acousticnessRange: [0.0, 0.6],
      instrumentalnessRange: [0.0, 0.5],
    },
  },
  {
    key: "sad",
    name: "Sad",
    description: "Melancólico, introspectivo, tempo más bajo.",
    audioFeatures: {
      valenceRange: [0.0, 0.4],
      energyRange: [0.1, 0.5],
      danceabilityRange: [0.0, 0.5],
      tempoRange: [50, 100],
      acousticnessRange: [0.3, 1.0],
      instrumentalnessRange: [0.0, 1.0],
    },
  },
  {
    key: "energetic",
    name: "Energetic",
    description: "Alta energía, pensado para momentos de hype.",
    audioFeatures: {
      valenceRange: [0.4, 1.0],
      energyRange: [0.7, 1.0],
      danceabilityRange: [0.5, 1.0],
      tempoRange: [120, 170],
      acousticnessRange: [0.0, 0.4],
      instrumentalnessRange: [0.0, 0.7],
    },
  },
  {
    key: "nostalgic",
    name: "Nostalgic",
    description: "Emocional y nostálgico, mezcla de luz y sombra.",
    audioFeatures: {
      valenceRange: [0.2, 0.7],
      energyRange: [0.2, 0.7],
      danceabilityRange: [0.2, 0.7],
      tempoRange: [70, 120],
      acousticnessRange: [0.2, 0.9],
      instrumentalnessRange: [0.0, 0.9],
    },
  },
  {
    key: "dark",
    name: "Dark",
    description: "Más intenso y dramático, tonos algo más oscuros.",
    audioFeatures: {
      valenceRange: [0.0, 0.3],
      energyRange: [0.4, 0.9],
      danceabilityRange: [0.2, 0.8],
      tempoRange: [80, 140],
      acousticnessRange: [0.0, 0.6],
      instrumentalnessRange: [0.2, 1.0],
    },
  },
];

function MoodWidget({ onChange }) {
  const [selectedKey, setSelectedKey] = useState(null);

  const handleSelectMood = (key) => {
    setSelectedKey(key);
    const moodConfig = MOODS.find((mood) => mood.key === key) || null;
    if (onChange) {
      onChange(moodConfig);
    }
  };

  return (
    <div className="relative rounded-2xl border border-emerald-900/60 bg-gradient-to-b from-stone-900/90 via-[#050608] to-black p-4 shadow-[0_0_30px_rgba(6,95,70,0.45)]">
      {/* Vibe bosque / niebla folklore/evermore */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_55%)] opacity-70" />

      <div className="relative space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-serif uppercase tracking-[0.25em] text-slate-300/80">
              Folklore · Evermore moods
            </p>
            <h3 className="text-[12px] font-serif uppercase tracking-[0.22em] text-slate-100">
              Estado de ánimo
            </h3>
            <p className="text-[11px] text-slate-300/90 font-light">
              Elige un mood para tu playlist. Lo traduciremos a rangos de
              audio features de Spotify: valence, energy, tempo, etc.
            </p>
          </div>
          <span className="text-[10px] font-serif uppercase tracking-[0.20em] text-slate-500">
            Widget
          </span>
        </div>

        {/* Lista de moods estilo tarjetas de bosque */}
        <div className="grid gap-2 text-[11px]">
          {MOODS.map((mood) => {
            const active = mood.key === selectedKey;

            return (
              <button
                key={mood.key}
                type="button"
                onClick={() => handleSelectMood(mood.key)}
                className={[
                  "flex w-full flex-col items-start rounded-xl border px-3 py-2 text-left transition",
                  active
                    ? "border-emerald-300/80 bg-emerald-900/40 shadow-[0_0_22px_rgba(16,185,129,0.5)]"
                    : "border-stone-700/80 bg-stone-950/70 hover:border-emerald-700/80 hover:bg-stone-900/80",
                ].join(" ")}
              >
                <span className="font-medium text-slate-100 font-serif">
                  {mood.name}
                </span>
                <span className="text-[10px] text-slate-300/90">
                  {mood.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Resumen del mood elegido */}
        {selectedKey && (
          <div className="mt-3 rounded-xl border border-stone-700/80 bg-black/70 px-3 py-2 text-[10px] text-slate-200/90">
            <p className="mb-1 font-semibold font-serif">
              Mood actual: {MOODS.find((m) => m.key === selectedKey)?.name}
            </p>
            <p className="text-[10px] text-slate-400">
              Esta selección se usará para filtrar o ponderar canciones según
              sus audio features cuando generemos la playlist.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MoodWidget;