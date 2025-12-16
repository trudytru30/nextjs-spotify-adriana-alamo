"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, logout } from "@/lib/auth";
import { generatePlaylist } from "@/lib/spotify";

import ArtistWidget from "@/components/widgets/ArtistWidget";
import GenreWidget from "@/components/widgets/GenreWidget";
import DecadeWidget from "@/components/widgets/DecadeWidget";
import PopularityWidget from "@/components/widgets/PopularityWidget";
import MoodWidget from "@/components/widgets/MoodWidget";
import FavoritesWidget from "@/components/widgets/FavoritesWidget";
import TrackWidget from "@/components/widgets/TrackWidget";

// Convertir valor de popularidad simple a rango [min, max]
function mapPopularityToRange(value) {
  if (value <= 30) return [0, 50];
  if (value <= 60) return [30, 80];
  return [60, 100];
}

// Formatear duración en ms a mm:ss
function formatDuration(ms) {
  if (ms == null) return "";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = seconds < 10 ? `0${seconds}` : String(seconds);
  return `${minutes}:${paddedSeconds}`;
}

// Labels para los presets de álbum
const MOOD_ALBUM_LABELS = {
  debut: "Debut",
  fearless: "Fearless",
  speaknow: "Speak Now",
  red: "Red",
  "1989": "1989",
  reputation: "reputation",
  lover: "Lover",
  folklore: "folklore",
  evermore: "evermore",
  midnights: "Midnights",
  ttpd: "The Tortured Poets Department",
};

const PREFERENCES_STORAGE_KEY = "tasteMixerPreferences";

// Fusionar tracks sin duplicados
function mergeTracksUnique(current, incoming) {
  const map = new Map(current.map((t) => [t.id, t]));
  for (const track of incoming) {
    if (!map.has(track.id)) {
      map.set(track.id, track);
    }
  }
  return Array.from(map.values());
}

function DashboardPage() {
  const router = useRouter();

  // ESTADO DE PREFERENCIAS
  const [artists, setArtists] = useState([]);
  const [seedTracks, setSeedTracks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [decades, setDecades] = useState([]);
  const [yearRange, setYearRange] = useState({ fromYear: null, toYear: null });
  const [popularity, setPopularity] = useState(70);
  const [mood, setMood] = useState(null);

  // PLAYLIST GENERADA
  const [tracks, setTracks] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // FAVORITOS
  const [favoriteTracks, setFavoriteTracks] = useState([]);

  // Control de carga de preferencias
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Derivar nombre del álbum/era actual
  const currentMoodAlbum =
    mood && mood.preset
      ? MOOD_ALBUM_LABELS[mood.preset] || mood.preset
      : null;

  // Protección de ruta - verificar autenticación
  useEffect(() => {
    console.log('Verificando autenticación en dashboard...');
    
    if (!isAuthenticated()) {
      console.log('No autenticado, redirigiendo al login...');
      router.replace("/");
    } else {
      console.log('Usuario autenticado');
      setIsCheckingAuth(false);
    }
  }, [router]);

  // Cargar preferencias desde localStorage
  useEffect(() => {
    if (isCheckingAuth) return;

    try {
      console.log('Cargando preferencias guardadas...');
      const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      
      if (!raw) {
        console.log('No hay preferencias guardadas');
        setPreferencesLoaded(true);
        return;
      }

      const parsed = JSON.parse(raw);
      console.log('Preferencias cargadas:', parsed);

      if (parsed.artists) setArtists(parsed.artists);
      if (parsed.seedTracks) setSeedTracks(parsed.seedTracks);
      if (parsed.genres) setGenres(parsed.genres);
      if (parsed.decades) setDecades(parsed.decades);
      if (parsed.yearRange) setYearRange(parsed.yearRange);
      if (typeof parsed.popularity === "number") {
        setPopularity(parsed.popularity);
      }
      if (parsed.mood) setMood(parsed.mood);
    } catch (err) {
      console.error('Error cargando preferencias:', err);
    } finally {
      setPreferencesLoaded(true);
    }
  }, [isCheckingAuth]);

  // Guardar preferencias en localStorage cuando cambien
  useEffect(() => {
    if (!preferencesLoaded || isCheckingAuth) return;

    const payload = {
      artists,
      seedTracks,
      genres,
      decades,
      yearRange,
      popularity,
      mood,
    };

    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(payload));
      console.log('Preferencias guardadas');
    } catch (err) {
      console.error('Error guardando preferencias:', err);
    }
  }, [
    artists,
    seedTracks,
    genres,
    decades,
    yearRange,
    popularity,
    mood,
    preferencesLoaded,
    isCheckingAuth,
  ]);

  // Cargar favoritos desde localStorage
  useEffect(() => {
    if (isCheckingAuth) return;

    try {
      const stored = localStorage.getItem("favoriteTracks");
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavoriteTracks(parsed);
        console.log('Favoritos cargados:', parsed.length);
      }
    } catch (err) {
      console.error('Error cargando favoritos:', err);
    }
  }, [isCheckingAuth]);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    if (isCheckingAuth) return;

    try {
      localStorage.setItem("favoriteTracks", JSON.stringify(favoriteTracks));
    } catch (err) {
      console.error('Error guardando favoritos:', err);
    }
  }, [favoriteTracks, isCheckingAuth]);

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    logout();
    router.replace("/");
  };

  // Añadir / quitar favorito
  const toggleFavorite = (track) => {
    setFavoriteTracks((prev) => {
      const exists = prev.some((t) => t.id === track.id);
      if (exists) {
        console.log('Eliminando favorito:', track.name);
        return prev.filter((t) => t.id !== track.id);
      }
      console.log('Añadiendo favorito:', track.name);
      return [...prev, track];
    });
  };

  // Eliminar track del setlist
  const removeTrack = (trackId) => {
    setTracks((prev) => prev.filter((t) => t.id !== trackId));
    console.log('Track eliminado del setlist');
  };

  // Construir preferencias finales
  const buildFinalPreferences = () => {
    const popularityRange = Array.isArray(popularity)
      ? popularity
      : mapPopularityToRange(popularity);

    return {
      artists,
      genres,
      decades,
      yearRange,
      popularity: popularityRange,
      mood,
      seedTracks,
      favoriteTracks,
    };
  };

  // Generar / refrescar playlist
  const handleGeneratePlaylist = async () => {
    setError("");
    console.log('Generando nueva playlist...');

    const finalPreferences = buildFinalPreferences();
    console.log('Preferencias finales:', finalPreferences);

    try {
      setIsGenerating(true);
      const newTracks = await generatePlaylist(finalPreferences);
      setTracks(newTracks);
      console.log(`Playlist generada con ${newTracks.length} canciones`);
    } catch (err) {
      console.error('Error generando playlist:', err);
      setError(err.message || "Hubo un problema al generar la playlist.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Añadir más canciones sin perder las actuales
  const handleAddMoreTracks = async () => {
    setError("");
    console.log('Añadiendo más canciones...');

    const finalPreferences = buildFinalPreferences();

    try {
      setIsGenerating(true);
      const moreTracks = await generatePlaylist(finalPreferences);
      setTracks((prev) => mergeTracksUnique(prev, moreTracks));
      console.log(`Añadidas más canciones`);
    } catch (err) {
      console.error('Error añadiendo canciones:', err);
      setError(err.message || "Hubo un problema al añadir más canciones.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Pantalla de carga mientras verifica autenticación
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-slate-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-zinc-300">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-slate-950 to-black text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.18),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.20),_transparent_55%)]" />

      <div className="relative z-10">
        {/* HEADER */}
        <header className="border-b border-white/10 bg-black/40 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.25em] text-purple-200/70">
                The Eras Tour inspired
              </p>
              <h1 className="text-2xl font-semibold tracking-tight">
                Spotify Taste Mixer
              </h1>
              <p className="text-xs text-zinc-300/80">
                Diseña tu propio setlist mezclando eras, estados de ánimo y
                décadas.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-white/30 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] hover:bg-white/15 transition"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        {/* MAIN */}
        <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
          {/* CINTA SUPERIOR */}
          <section className="rounded-2xl border border-white/10 bg-gradient-to-r from-fuchsia-500/20 via-sky-500/10 to-indigo-500/20 px-4 py-3 text-xs backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-white/30 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.22em]">
                  Tour dashboard
                </span>
                {currentMoodAlbum && (
                  <span className="rounded-full border border-white/40 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-sky-100">
                    Mood: {currentMoodAlbum}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-black/40 px-3 py-1">
                  Eras: {decades.length}
                </span>
                <span className="rounded-full bg-black/40 px-3 py-1">
                  Artistas: {artists.length}
                </span>
                <span className="rounded-full bg-black/40 px-3 py-1">
                  Tracks: {seedTracks.length}
                </span>
                <span className="rounded-full bg-black/40 px-3 py-1">
                  Géneros: {genres.length}
                </span>
              </div>
            </div>
          </section>

          {/* LAYOUT DOS COLUMNAS */}
          <section className="grid gap-5 lg:grid-cols-[2fr_2.2fr]">
            {/* IZQUIERDA - Widgets */}
            <div className="space-y-4">
              <ArtistWidget onChange={setArtists} />
              <TrackWidget onChange={setSeedTracks} />
              <GenreWidget onChange={setGenres} />
              <DecadeWidget
                onChange={setDecades}
                onRangeChange={setYearRange}
              />
              <MoodWidget onChange={setMood} />
              <PopularityWidget onChange={setPopularity} />
            </div>

            {/* DERECHA - Setlist + Favoritas */}
            <div className="space-y-4">
              {/* SETLIST */}
              <div className="rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="block text-zinc-300">
                      {tracks.length === 0
                        ? "Aún no hay canciones en tu setlist."
                        : `Tienes ${tracks.length} canciones en tu setlist.`}
                    </span>
                    {currentMoodAlbum && (
                      <span className="block text-[10px] text-zinc-400">
                        Mood actual:{" "}
                        <span className="font-semibold text-zinc-200">
                          {currentMoodAlbum}
                        </span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleGeneratePlaylist}
                      disabled={isGenerating}
                      className="rounded-full border border-white/30 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] hover:bg-white/15 disabled:opacity-40 transition"
                    >
                      {tracks.length === 0
                        ? isGenerating
                          ? "Generando..."
                          : "Generar playlist"
                        : isGenerating
                        ? "Refrescando..."
                        : "Refrescar playlist"}
                    </button>
                    <button
                      onClick={handleAddMoreTracks}
                      disabled={isGenerating || tracks.length === 0}
                      className="rounded-full border border-white/25 bg-transparent px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-200 hover:bg-white/10 disabled:opacity-30 transition"
                    >
                      {isGenerating ? "Añadiendo..." : "Añadir más"}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mt-2 rounded-lg border border-rose-500/50 bg-rose-900/20 px-3 py-2">
                    <p className="text-sm text-rose-300">{error}</p>
                  </div>
                )}

                {/* LISTA DE TEMAS */}
                <ul className="mt-3 space-y-2 text-[11px] text-zinc-200 max-h-[600px] overflow-y-auto pr-2">
                  {tracks.map((track) => {
                    const artistsNames = track.artists
                      ?.map((a) => a.name)
                      .join(", ");
                    const cover =
                      track.album?.images &&
                      track.album.images.length > 0 &&
                      track.album.images[0].url;

                    const isFavorite = favoriteTracks.some(
                      (f) => f.id === track.id
                    );

                    return (
                      <li
                        key={track.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/60 px-3 py-2 hover:border-white/20 transition"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          {cover ? (
                            <img
                              src={cover}
                              alt={track.name}
                              className="h-10 w-10 flex-shrink-0 rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 flex-shrink-0 rounded-md bg-zinc-800" />
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {track.name}
                            </p>
                            <p className="truncate text-[10px] text-zinc-400">
                              {artistsNames}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-shrink-0 items-center gap-3">
                          <span className="text-[10px] text-zinc-400">
                            {formatDuration(track.duration_ms)}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleFavorite(track)}
                              className={`rounded-full border px-2 py-1 text-[10px] transition ${
                                isFavorite
                                  ? 'border-pink-400/70 bg-pink-600/30 text-pink-200 hover:bg-pink-600/50'
                                  : 'border-white/20 hover:bg-white/10'
                              }`}
                            >
                              {isFavorite ? "Fav" : "Add"}
                            </button>
                            <button
                              onClick={() => removeTrack(track.id)}
                              className="rounded-full border border-rose-400/70 px-2 py-1 text-[10px] text-rose-200 hover:bg-rose-600/70 hover:border-rose-300 transition"
                            >
                              Quitar
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {tracks.length === 0 && !error && (
                  <div className="mt-4 text-center py-8">
                    <p className="text-zinc-400 text-sm">
                      Configura tus widgets y pulsa "Generar playlist" para empezar
                    </p>
                  </div>
                )}
              </div>

              {/* WIDGET LOVER - FAVORITAS */}
              <FavoritesWidget
                favorites={favoriteTracks}
                onClear={() => setFavoriteTracks([])}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;