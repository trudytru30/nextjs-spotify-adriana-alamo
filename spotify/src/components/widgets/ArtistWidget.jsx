"use client";

import { useState } from "react";
import { getAccessToken } from "@/lib/auth";

function ArtistWidget({ onChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (event) => {
    event.preventDefault();
    setError("");

    const trimmed = query.trim();
    if (!trimmed) return;

    const token = getAccessToken();
    if (!token) {
      setError("No se encontró un token válido. Vuelve a iniciar sesión.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          trimmed
        )}&type=artist&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        setError("Error al buscar artistas. Inténtalo de nuevo.");
        return;
      }

      const data = await response.json();
      setResults(data?.artists?.items ?? []);
    } catch {
      setError("No se pudo conectar con Spotify.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddArtist = (artist) => {
    if (selectedArtists.some((a) => a.id === artist.id)) return;

    const updated = [...selectedArtists, artist];
    setSelectedArtists(updated);
    if (onChange) onChange(updated);
  };

  const handleRemoveArtist = (artistId) => {
    const updated = selectedArtists.filter((a) => a.id !== artistId);
    setSelectedArtists(updated);
    if (onChange) onChange(updated);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-teal-300/70 bg-gradient-to-b from-teal-700/70 via-slate-950 to-black p-4 shadow-[0_0_55px_rgba(20,184,166,0.7)]">
      {/* Halo glam menta */}
      <div className="pointer-events-none absolute -top-12 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(34,211,238,0.6),_transparent_65%)] blur-xl" />
      
      {/* Halo naranja brillante */}
      <div className="pointer-events-none absolute -bottom-20 right-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.55),_transparent_60%)] blur-xl" />

      {/* Purpurina flotante */}
      <div className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-[0.25] mix-blend-screen" />

      <div className="relative space-y-4">
        {/* Cabecera showgirl (menta + naranja) */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/80 bg-black/40 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-300 shadow-[0_0_10px_rgba(253,186,116,0.9)]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-teal-200">
                The life of a showgirl
              </span>
            </div>
            <h3 className="text-sm font-semibold tracking-tight text-teal-100">
              Artistas en tu show principal
            </h3>
            <p className="text-[11px] text-teal-100/80">
              Añade artistas que actuarán en tu playlist.  
              Este widget es el casting estelar de tu espectáculo.
            </p>
          </div>
          <span className="mt-1 text-[10px] uppercase tracking-[0.20em] text-teal-300/80">
            Widget
          </span>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSearch} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Buscar artistas en Spotify"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-full border border-teal-300/60 bg-black/50 px-3 py-2 text-xs text-teal-100 placeholder:text-teal-200/50 focus:outline-none focus:ring-2 focus:ring-teal-300/70"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-full border border-orange-200/80 bg-orange-300 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.20em] text-slate-900 shadow-[0_0_18px_rgba(253,186,116,0.8)] transition hover:bg-orange-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Buscando…" : "Buscar"}
            </button>
          </div>

          {error && <p className="text-[11px] text-orange-200">{error}</p>}
        </form>

        {/* Artistas seleccionados */}
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-teal-100">
            Artistas seleccionados
          </p>

          {selectedArtists.length === 0 ? (
            <p className="text-[11px] text-teal-200/60">
              No hay nadie en tu show todavía. Añade a tus artistas favoritos.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedArtists.map((artist) => (
                <button
                  key={artist.id}
                  type="button"
                  onClick={() => handleRemoveArtist(artist.id)}
                  className="group flex items-center gap-1 rounded-full border border-teal-300/80 bg-teal-700/70 px-3 py-1 text-[11px] text-teal-50 shadow-[0_0_15px_rgba(20,184,166,0.7)] transition hover:bg-orange-300 hover:text-black"
                >
                  <span>{artist.name}</span>
                  <span className="text-[10px] group-hover:text-black">
                    · Quitar
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Resultados */}
        {results.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-medium text-teal-100">Casting disponible</p>

            <ul className="max-h-40 space-y-1 overflow-y-auto pr-1 text-[11px]">
              {results.map((artist) => (
                <li
                  key={artist.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-teal-400/40 bg-black/60 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-teal-100">
                      {artist.name}
                    </p>
                    {artist.genres?.length > 0 && (
                      <p className="truncate text-[10px] text-teal-200/70">
                        {artist.genres.slice(0, 2).join(" · ")}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddArtist(artist)}
                    className="rounded-full border border-teal-300/70 bg-teal-600/80 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-teal-50 transition hover:bg-orange-300 hover:text-black hover:border-orange-200"
                  >
                    Añadir
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArtistWidget;