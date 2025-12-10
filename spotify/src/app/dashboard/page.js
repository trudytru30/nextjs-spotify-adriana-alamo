"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, logout } from "@/lib/auth";
import ArtistWidget from "@/components/widgets/ArtistWidget";
import DecadeWidget from "@/components/widgets/DecadeWidget";
import PopularityWidget from "@/components/widgets/PopularityWidget";



function DashboardPage() {
  const router = useRouter();

  // Protección de ruta: si no está autenticado, vuelve al inicio
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/");
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-slate-950 to-black text-white">
      {/* Capa de brillo suave estilo show de luces */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.18),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.20),_transparent_55%)]" />

      {/* Contenido */}
      <div className="relative z-10">
        {/* Header tipo Eras Tour */}
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

            <div className="flex items-center gap-3">
              <div className="hidden text-right text-[11px] text-zinc-300/80 sm:block">
                <p className="uppercase tracking-[0.18em]">
                  Session
                </p>
                <p className="text-xs text-zinc-400">
                  Listener mode
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/30 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition hover:bg-white/15"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
          {/* Cinta de estado tipo gira */}
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-fuchsia-500/20 via-sky-500/10 to-indigo-500/20 px-4 py-3 text-xs backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/30 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.22em]">
                  Tour dashboard
                </span>
                <span className="text-[11px] text-zinc-100/90">
                  Ajusta tus preferencias para crear una playlist que recorra tus eras.
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] text-zinc-100/85">
                <span className="rounded-full bg-black/40 px-3 py-1">
                  Eras activas: por definir
                </span>
                <span className="rounded-full bg-black/40 px-3 py-1">
                  Setlist: vacío
                </span>
              </div>
            </div>
          </section>

          {/* Layout principal: preferencias vs playlist */}
          <section className="grid gap-5 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,2.8fr)]">
            {/* Columna izquierda: preferencias / widgets */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.20em] text-zinc-200">
                    Tus eras y preferencias
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Aquí irán los widgets inspirados en cada era de Taylor.
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.20em] text-zinc-500">
                  Step 1 · Configura tu mood
                </span>
              </div>

              {/* Grid de widgets (por ahora placeholders, luego los vestimos por era) */}
              <div className="grid gap-4 md:grid-cols-2">
                <ArtistWidget />
              </div>

                {/* Géneros */}
                <div className="group rounded-2xl border border-white/10 bg-gradient-to-b from-pink-500/15 via-black/40 to-black/60 p-4 shadow-[0_0_40px_rgba(236,72,153,0.35)]">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.20em] text-zinc-100">
                    Géneros
                  </h3>
                  <p className="mt-1 text-[11px] text-zinc-300/85">
                    Aquí colocaremos el widget de géneros. Más adelante lo
                    adaptamos a la era que nos indiques.
                  </p>
                  <div className="mt-3 h-10 rounded-xl border border-dashed border-white/15 bg-black/30" />
                </div>

                <div className="md:col-span-2">
                    <DecadeWidget />
                </div>
                

                {/* Mood / Estado de ánimo */}
                <div className="group rounded-2xl border border-white/10 bg-gradient-to-b from-emerald-500/15 via-black/40 to-black/60 p-4 shadow-[0_0_40px_rgba(16,185,129,0.35)]">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.20em] text-zinc-100">
                    Estado de ánimo
                  </h3>
                  <p className="mt-1 text-[11px] text-zinc-300/85">
                    Aquí irá el widget de mood (calm, fearless, reputation, etc.).
                  </p>
                  <div className="mt-3 h-10 rounded-xl border border-dashed border-white/15 bg-black/30" />
                </div>

                {/* Popularidad – widget inspirado en 1989 */}
                <div className="md:col-span-2">
                    <PopularityWidget />
                </div>


            {/* Columna derecha: playlist / setlist generado */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.20em] text-zinc-200">
                    Setlist generado
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Cuando conectemos los widgets con la API, aquí aparecerán las canciones.
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.20em] text-zinc-500">
                  Step 2 · Curate your tour
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 text-xs">
                  <span className="text-zinc-300">
                    Aún no hay canciones en tu setlist.
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-white/30 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] transition hover:bg-white/15"
                    >
                      Generar playlist
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-white/20 bg-transparent px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-300 hover:bg-white/10"
                    >
                      Añadir más canciones
                    </button>
                  </div>
                </div>

                {/* Placeholder de lista de temas */}
                <div className="mt-3 space-y-2 text-[11px] text-zinc-300/85">
                  <p>
                    Más adelante aquí incluiremos:
                  </p>
                  <ul className="ml-4 list-disc space-y-1">
                    <li>Listado de canciones con título, artista y era aproximada.</li>
                    <li>Botones para eliminar canciones del setlist.</li>
                    <li>Marcadores de favoritos con persistencia en localStorage.</li>
                    <li>Acciones para refrescar y combinar nuevas eras.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
