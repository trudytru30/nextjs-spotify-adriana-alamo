"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth";

const FALLBACK_GENRES = [
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
  const [suggestedGenres, setSuggestedGenres] = useState(FALLBACK_GENRES);
  const [genreFilter, setGenreFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setError(
        "No se encontró un token válido. Vuelve a iniciar sesión para cargar géneros de Spotify."
      );
      return;
    }

    const fetchGenres = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          "https://api.spotify.com/v1/recommendations/available-genre-seeds",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Respuesta no válida de Spotify");
        }

        const data = await response.json();

        if (Array.isArray(data.genres) && data.genres.length > 0) {
          setSuggestedGenres(data.genres);
        }
      } catch (err) {
        setError(
          "No se pudieron cargar los géneros desde Spotify. Usando lista por defecto."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const filteredGenres = suggestedGenres.filter((genre) => {
    const filter = genreFilter.trim().toLowerCase();
    if (!filter) return true;
    return genre.toLowerCase().includes(filter);
  });

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-red-400/80 bg-gradient-to-br from-red-900/60 via-red-950/80 to-black p-4 shadow-[0_8px_32px_rgba(239,68,68,0.4)]">
      <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,_rgba(239,68,68,0.3),_transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(185,28,28,0.25),_transparent_70%)] blur-2xl" />
      
      <div className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />

      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-red-300/70 bg-black/60 px-4 py-1.5 backdrop-blur-sm shadow-lg">
              <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-red-100">
                Red - Genres
              </p>
            </div>
            <h3 className="text-sm font-bold tracking-tight text-red-50 drop-shadow-md">
              Géneros que colorean tu historia
            </h3>
            <p className="text-[11px] text-red-100/90 leading-relaxed font-medium">
              Elige los géneros que quieres que definan el tono de tu playlist.
              Puedes combinar sugerencias y añadir los tuyos propios.
            </p>
          </div>

          <div className="rounded-xl border-2 border-red-300/60 bg-black/70 px-3 py-2 text-right backdrop-blur-sm shadow-xl">
            <p className="text-[9px] uppercase tracking-[0.24em] text-red-300 font-bold">
              Selected
            </p>
            <p className="text-2xl font-black text-transparent bg-gradient-to-r from-red-400 to-rose-600 bg-clip-text">
              {selectedGenres.length}
            </p>
            <p className="text-[9px] font-bold text-red-400">
              genres
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="rounded-lg border-2 border-red-400/50 bg-red-900/20 px-4 py-2 backdrop-blur-sm">
            <p className="text-[11px] text-red-200 font-medium">
              Cargando géneros desde Spotify...
            </p>
          </div>
        )}
        
        {error && (
          <div className="rounded-lg border-2 border-red-400/60 bg-red-900/30 px-4 py-2 backdrop-blur-sm">
            <p className="text-[11px] text-red-200 font-medium">
              {error}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-red-50 uppercase tracking-wide">
              Géneros seleccionados
            </p>
            {selectedGenres.length > 0 && (
              <span className="text-[10px] text-red-300/80 font-semibold">
                {selectedGenres.length} activos
              </span>
            )}
          </div>
          
          {selectedGenres.length === 0 ? (
            <div className="rounded-xl border-2 border-red-400/40 bg-black/50 px-4 py-3 backdrop-blur-sm">
              <p className="text-[11px] text-red-100/70 leading-relaxed">
                Aún no has elegido ningún género. Empieza seleccionando algunos
                de la lista o añade los tuyos.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedGenres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className="group rounded-full border-2 border-red-300/90 bg-gradient-to-r from-red-700/80 to-red-800/80 px-4 py-2 text-[11px] font-bold text-red-50 shadow-[0_4px_16px_rgba(239,68,68,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_24px_rgba(239,68,68,0.7)] hover:bg-gradient-to-r hover:from-black hover:to-red-950"
                >
                  <span>{genre}</span>
                  <span className="ml-2 text-[10px] text-red-200/90 group-hover:text-red-300 font-semibold">
                    Quitar
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-bold text-red-50 uppercase tracking-wide">
            Buscar en géneros disponibles
          </p>
          
          <div className="relative">
            <input
              type="text"
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              placeholder="Escribe para filtrar géneros..."
              className="w-full rounded-full border-2 border-red-300/70 bg-black/70 px-4 py-2.5 text-xs font-medium text-red-50 placeholder:text-red-300/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 shadow-inner"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/5 to-transparent pointer-events-none" />
          </div>
          
          <p className="text-[10px] text-red-200/70 font-medium">
            Se muestran los géneros que coinciden con tu búsqueda.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-bold text-red-50 uppercase tracking-wide">
            Sugerencias
          </p>
          <div className="flex flex-wrap gap-2">
            {filteredGenres.map((genre) => {
              const active = selectedGenres.some(
                (g) => normalize(g) === normalize(genre)
              );
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={[
                    "rounded-full border-2 px-4 py-1.5 text-[10px] font-bold capitalize transition-all duration-300",
                    active
                      ? "border-red-300 bg-gradient-to-r from-red-600 to-red-700 text-red-50 shadow-[0_4px_16px_rgba(239,68,68,0.6)] scale-105"
                      : "border-red-700/80 bg-black/70 text-red-100/85 hover:border-red-400 hover:bg-red-800/60 hover:scale-105 hover:shadow-[0_4px_12px_rgba(239,68,68,0.4)]",
                  ].join(" ")}
                >
                  {genre}
                </button>
              );
            })}
            {filteredGenres.length === 0 && (
              <div className="w-full rounded-xl border-2 border-red-400/40 bg-black/50 px-4 py-3 backdrop-blur-sm">
                <p className="text-[11px] text-red-100/70">
                  Ningún género coincide con tu búsqueda.
                </p>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleAddCustom} className="space-y-3">
          <p className="text-[11px] font-bold text-red-50 uppercase tracking-wide">
            Añadir género personalizado
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={customGenre}
                onChange={(e) => setCustomGenre(e.target.value)}
                placeholder="Por ejemplo: dream pop, indie folk..."
                className="w-full rounded-full border-2 border-red-300/70 bg-black/70 px-4 py-2.5 text-xs font-medium text-red-50 placeholder:text-red-300/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 shadow-inner"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/5 to-transparent pointer-events-none" />
            </div>
            <button
              type="submit"
              className="rounded-full border-2 border-red-300/90 bg-gradient-to-r from-red-500 to-red-600 px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.20em] text-white shadow-[0_4px_16px_rgba(239,68,68,0.6)] transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_24px_rgba(239,68,68,0.8)] hover:from-red-400 hover:to-red-500"
            >
              Añadir
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between pt-2 border-t-2 border-red-900/50">
          <div className="text-[9px] text-red-300/70 font-bold uppercase tracking-wider">
            All Too Well Era
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.8)]" />
            <div className="h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.8)]" />
            <div className="h-1.5 w-1.5 rounded-full bg-red-600 shadow-[0_0_6px_rgba(220,38,38,0.8)]" />
          </div>
          <div className="text-[9px] text-red-300/70 font-bold uppercase tracking-wider">
            Genre Selection
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenreWidget;