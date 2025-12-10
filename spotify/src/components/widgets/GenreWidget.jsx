"use client";

import { useState } from "react";

const SUGGESTED_GENRES = [
  "pop",
  "pop rock",
  "country",
  "country pop",
  "indie",
  "indie pop",
  "alternative",
  "rock",
  "singer-songwriter",
  "folk",
  "electropop",
];

function GenreWidget({ onChange }) {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [customGenre, setCustomGenre] = useState("");

  const normalize = (value) => value.trim().toLowerCase();

  const updateGenres = (newGenres) => {
    setSelectedGenres(newGenres);
    if (onChange) {
      onChange(newGenres);
    }
  };

  const toggleGenre = (genre) => {
    const norm = normalize(genre);
    const exists = selectedGenres.some((g) => normalize(g) === norm);

    if (exists) {
      updateGenres(selectedGenres.filter((g) => normalize(g) !== norm));
    } else {
      updateGenres([...selectedGenres, genre]);
    }
  };

  const handleAddCustom = (event) => {
    event.preventDefault();
    const trimmed = customGenre.trim();
    if (!trimmed) return;

    const norm = normalize(trimmed);
    const exists = selectedGenres.some((g) => normalize(g) === norm);

    if (!exists) {
      updateGenres([...selectedGenres, trimmed]);
    }
    setCustomGenre("");
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-400/70 bg-gradient-to-b from-[#3b1212] via-black to-black p-4 shadow-[0_0_40px_rgba(248,113,113,0.65)]">
      {/* halo rojizo */}
      <div className="pointer-events-none absolute -top-12 left-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(248,113,113,0.5),_transparent_60%)] blur-xl" />
      <div className="pointer-events-none absolute -bottom-16 right-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(127,29,29,0.6),_transparent_60%)] blur-xl" />

      <div className="relative space-y-3">
        {/* Cabecera Red */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="inline-flex items-center rounded-full border border-red-300/80 bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-100">
              Red · genres
            </p>
            <h3 className="text-sm font-semibold tracking-tight text-red-50">
              Géneros que colorean tu historia
            </h3>
            <p className="text-[11px] text-red-100/85">
              Elige los géneros que quieres que definan el tono de tu playlist.
              Puedes combinar sugerencias y añadir los tuyos propios.
            </p>
          </div>
          <span className="mt-1 text-[10px] uppercase tracking-[0.20em] text-red-200/80">
            Widget
          </span>
        </div>

        {/* Géneros seleccionados */}
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-red-50">
            Géneros seleccionados
          </p>
          {selectedGenres.length === 0 ? (
            <p className="text-[11px] text-red-100/70">
              Aún no has elegido ningún género. Empieza seleccionando algunos
              de la lista o añade los tuyos.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedGenres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className="group rounded-full border border-red-300/80 bg-red-800/70 px-3 py-1 text-[11px] text-red-50 shadow-[0_0_14px_rgba(248,113,113,0.8)] transition hover:bg-black hover:text-red-200"
                >
                  <span>{genre}</span>
                  <span className="ml-1 text-[10px] text-red-200/90 group-hover:text-red-300">
                    · Quitar
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sugerencias de géneros */}
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-red-50">
            Sugerencias
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_GENRES.map((genre) => {
              const active = selectedGenres.some(
                (g) => normalize(g) === normalize(genre)
              );
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={[
                    "rounded-full border px-3 py-1 text-[10px] capitalize transition",
                    active
                      ? "border-red-300 bg-red-600/90 text-red-50 shadow-[0_0_12px_rgba(248,113,113,0.7)]"
                      : "border-red-700/80 bg-black/60 text-red-100/85 hover:border-red-300 hover:bg-red-800/60",
                  ].join(" ")}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Añadir género personalizado */}
        <form onSubmit={handleAddCustom} className="space-y-1">
          <p className="text-[11px] font-medium text-red-50">
            Añadir género personalizado
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={customGenre}
              onChange={(e) => setCustomGenre(e.target.value)}
              placeholder="Por ejemplo: dream pop, indie folk…"
              className="flex-1 rounded-full border border-red-300/70 bg-black/60 px-3 py-2 text-xs text-red-50 placeholder:text-red-200/60 focus:outline-none focus:ring-2 focus:ring-red-300/80"
            />
            <button
              type="submit"
              className="rounded-full border border-red-200/80 bg-red-300 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.20em] text-slate-900 shadow-[0_0_16px_rgba(248,113,113,0.8)] transition hover:bg-red-200"
            >
              Añadir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GenreWidget;