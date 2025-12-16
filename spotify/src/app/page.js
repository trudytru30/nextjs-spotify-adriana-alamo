"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getSpotifyAuthUrl } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar si ya está autenticado
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          console.log('Usuario ya autenticado, redirigiendo al dashboard...');
          router.push("/dashboard");
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error verificando autenticación:', err);
        setError('Error al verificar autenticación');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogin = () => {
    try {
      setError(null);
      console.log('Iniciando flujo de autenticación con Spotify...');
      
      const authUrl = getSpotifyAuthUrl();
      console.log('URL de autenticación generada:', authUrl);
      
      window.location.href = authUrl;
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Error al iniciar sesión. Verifica que las variables de entorno estén configuradas correctamente.');
    }
  };

  // Pantalla de carga mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-slate-950 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-zinc-300">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black text-white">
      {/* THE ERAS TOUR - Luces de concierto y escenario */}
      <div className="pointer-events-none fixed inset-0">
        {/* Spotlight principal - efecto foco de concierto */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_top,_rgba(168,85,247,0.4),_transparent_70%)]" />
        
        {/* Luces laterales de escenario - rosa/fucsia */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[radial-gradient(circle,_rgba(236,72,153,0.3),_transparent_60%)] blur-3xl" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[radial-gradient(circle,_rgba(244,114,182,0.3),_transparent_60%)] blur-3xl" />
        
        {/* Luces inferiores - azul/cyan */}
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[radial-gradient(circle,_rgba(56,189,248,0.25),_transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[radial-gradient(circle,_rgba(14,165,233,0.25),_transparent_70%)] blur-3xl" />
        
        {/* Efecto de estrellas/luces de escenario */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-[10%] w-2 h-2 bg-purple-300 rounded-full animate-pulse" />
          <div className="absolute top-32 right-[15%] w-1.5 h-1.5 bg-pink-300 rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
          <div className="absolute top-48 left-[20%] w-2 h-2 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute top-40 right-[25%] w-1 h-1 bg-purple-200 rounded-full animate-pulse" style={{animationDelay: '1.5s'}} />
          <div className="absolute bottom-40 left-[30%] w-1.5 h-1.5 bg-pink-200 rounded-full animate-pulse" style={{animationDelay: '2s'}} />
          <div className="absolute bottom-32 right-[20%] w-2 h-2 bg-blue-200 rounded-full animate-pulse" style={{animationDelay: '2.5s'}} />
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 md:flex-row md:items-center">
          {/* Columna izquierda: texto principal */}
          <section className="space-y-6 md:w-1/2">
            <div className="space-y-3">
              {/* Badge THE ERAS TOUR */}
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-purple-300/50 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 px-4 py-2 backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse" />
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-purple-100">
                  The Eras Tour Inspired
                </p>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent">
                  Spotify
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent">
                  Taste Mixer
                </span>
              </h1>
              
              <p className="text-lg text-purple-100/90 font-light">
                Diseña tu propio setlist musical
              </p>
            </div>

            <p className="max-w-md text-sm text-zinc-300/90 leading-relaxed">
              Diseña tu propio "tour" musical inspirado en The Eras Tour: 
              combina artistas, géneros, décadas, estados de ánimo y popularidad 
              para generar playlists personalizadas a partir de tu cuenta de Spotify.
            </p>

            {error && (
              <div className="rounded-xl border border-red-500/50 bg-red-900/20 px-4 py-3 backdrop-blur-sm">
                <p className="text-sm text-red-300">{error}</p>
                <p className="text-xs text-red-400 mt-1">
                  Verifica tu archivo .env.local con las credenciales de Spotify.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={handleLogin}
                disabled={!!error}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 px-8 py-4 text-sm font-bold uppercase tracking-[0.20em] text-white shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all hover:shadow-[0_0_60px_rgba(168,85,247,0.8)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10">Iniciar Sesión con Spotify</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <div className="text-[11px] text-center text-zinc-400">
                <p className="uppercase tracking-[0.22em]">
                  OAuth 2.0 Seguro
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Te redirigiremos a Spotify para autorizar la aplicación
                </p>
              </div>
            </div>

            {/* Features inspiradas en The Eras Tour */}
            <div className="grid gap-3 text-[11px] sm:grid-cols-3 pt-4">
              <div className="rounded-xl border border-purple-300/20 bg-gradient-to-br from-purple-900/40 to-transparent px-3 py-3 backdrop-blur-sm">
                <p className="uppercase tracking-[0.18em] text-purple-200 font-semibold">
                  Eras
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Décadas y épocas musicales
                </p>
              </div>
              <div className="rounded-xl border border-pink-300/20 bg-gradient-to-br from-pink-900/40 to-transparent px-3 py-3 backdrop-blur-sm">
                <p className="uppercase tracking-[0.18em] text-pink-200 font-semibold">
                  Setlist
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Playlist personalizada
                </p>
              </div>
              <div className="rounded-xl border border-blue-300/20 bg-gradient-to-br from-blue-900/40 to-transparent px-3 py-3 backdrop-blur-sm">
                <p className="uppercase tracking-[0.18em] text-blue-200 font-semibold">
                  Tour
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Viaja por tu música
                </p>
              </div>
            </div>
          </section>

          {/* Columna derecha: preview del dashboard */}
          <section className="md:w-1/2">
            <div className="relative mx-auto max-w-md">
              {/* Efecto de escenario/spotlight detrás */}
              <div className="absolute -inset-4 bg-gradient-to-b from-purple-500/20 via-pink-500/10 to-transparent blur-2xl" />
              
              <div className="relative rounded-3xl border border-white/10 bg-black/60 p-6 shadow-[0_0_80px_rgba(168,85,247,0.4)] backdrop-blur-xl">
                <div className="flex items-center justify-between text-[11px] text-zinc-300/85 mb-4">
                  <span className="rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/30 px-3 py-1 uppercase tracking-[0.20em] backdrop-blur-sm">
                    Dashboard Preview
                  </span>
                  <span className="text-zinc-500">Eras Tour</span>
                </div>

                <div className="space-y-3 rounded-2xl border border-white/10 bg-gradient-to-b from-purple-900/30 via-slate-950/50 to-black p-4">
                  <div className="mb-2 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-zinc-100">
                      Tu Setlist Musical
                    </span>
                    <span className="text-zinc-400 text-[10px]">Widgets</span>
                  </div>

                  <div className="grid gap-2 text-[10px] md:grid-cols-2">
                    {/* Cada era/widget representado */}
                    <div className="h-12 rounded-xl border border-purple-400/30 bg-gradient-to-br from-purple-900/60 to-black/40 px-3 py-2 backdrop-blur-sm">
                      <p className="font-medium text-purple-200 text-[10px]">
                        Artistas
                      </p>
                      <p className="text-[9px] text-purple-300/70">
                        Showgirl era
                      </p>
                    </div>
                    <div className="h-12 rounded-xl border border-red-400/30 bg-gradient-to-br from-red-900/60 to-black/40 px-3 py-2 backdrop-blur-sm">
                      <p className="font-medium text-red-200 text-[10px]">
                        Géneros
                      </p>
                      <p className="text-[9px] text-red-300/70">
                        Red era
                      </p>
                    </div>
                    <div className="h-12 rounded-xl border border-zinc-400/30 bg-gradient-to-br from-zinc-800/60 to-black/40 px-3 py-2 backdrop-blur-sm">
                      <p className="font-medium text-zinc-200 text-[10px]">
                        Décadas
                      </p>
                      <p className="text-[9px] text-zinc-400/70">
                        TTPD Fortnight
                      </p>
                    </div>
                    <div className="h-12 rounded-xl border border-emerald-400/30 bg-gradient-to-br from-emerald-900/60 to-black/40 px-3 py-2 backdrop-blur-sm">
                      <p className="font-medium text-emerald-200 text-[10px]">
                        Mood
                      </p>
                      <p className="text-[9px] text-emerald-300/70">
                        Folklore/Evermore
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-white/10 bg-black/60 px-3 py-3 text-[11px] backdrop-blur-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-zinc-100 text-[10px]">
                        Playlist Generada
                      </span>
                      <span className="text-[9px] text-zinc-500">
                        Preview
                      </span>
                    </div>
                    <div className="space-y-1 text-[9px] text-zinc-300/90">
                      <div className="flex items-center justify-between">
                        <span>Track 1 - Artist</span>
                        <span className="text-zinc-600">3:45</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Track 2 - Artist</span>
                        <span className="text-zinc-600">4:12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Track 3 - Artist</span>
                        <span className="text-zinc-600">3:28</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-center text-[10px] text-zinc-400 leading-relaxed">
                  Tras iniciar sesión, accederás al dashboard completo inspirado en 
                  The Eras Tour para crear tu setlist personalizado.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}