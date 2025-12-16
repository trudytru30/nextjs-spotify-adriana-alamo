"use client";

function FavoritesWidget({ favorites = [], onClear }) {
  const hasFavorites = favorites.length > 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-pink-300/80 bg-gradient-to-br from-pink-200/60 via-sky-200/50 to-rose-200/70 p-4 shadow-[0_8px_32px_rgba(236,72,153,0.4)]">
      <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,_rgba(251,207,232,0.7),_transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(125,211,252,0.5),_transparent_70%)] blur-2xl" />
      
      <div className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-25 mix-blend-overlay" />

      <div className="relative space-y-4 text-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-pink-300/90 bg-white/80 px-4 py-1.5 backdrop-blur-sm shadow-lg">
              <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-pink-700">
                Lover - Favorites
              </p>
            </div>
            <h3 className="text-sm font-bold tracking-tight drop-shadow-sm">
              Canciones favoritas
            </h3>
            <p className="text-[11px] text-pink-900/85 leading-relaxed font-medium">
              Canciones que has marcado como favoritas en tu setlist.
            </p>
          </div>

          <div className="rounded-xl border-2 border-pink-300/70 bg-white/80 px-3 py-2 text-right backdrop-blur-sm shadow-xl">
            <p className="text-[9px] uppercase tracking-[0.24em] text-pink-600 font-bold">
              Hearts
            </p>
            <p className="text-2xl font-black text-transparent bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text">
              {favorites.length}
            </p>
            <p className="text-[9px] font-bold text-pink-600">
              saved
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border-2 border-pink-300/70 bg-white/70 px-4 py-2 backdrop-blur-sm">
          <p className="text-[11px] text-pink-900/85 font-bold">
            {hasFavorites
              ? `Tienes ${favorites.length} canción${favorites.length === 1 ? "" : "es"} favorita${favorites.length === 1 ? "" : "s"}.`
              : "Todavía no has marcado ninguna canción como favorita."}
          </p>

          {hasFavorites && (
            <button
              onClick={onClear}
              className="rounded-full border-2 border-pink-300/90 bg-gradient-to-r from-pink-500 to-pink-600 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-[0_2px_8px_rgba(236,72,153,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_16px_rgba(236,72,153,0.6)] hover:from-pink-400 hover:to-pink-500"
            >
              Limpiar
            </button>
          )}
        </div>

        {hasFavorites && (
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">
              Tu colección favorita
            </p>
            <ul className="space-y-2 text-[11px]">
              {favorites.slice(0, 6).map((track) => (
                <li
                  key={track.id}
                  className="flex items-center justify-between rounded-xl border-2 border-pink-200/90 bg-white/80 px-3 py-2 backdrop-blur-sm transition-all duration-300 hover:border-pink-300 hover:shadow-[0_4px_12px_rgba(236,72,153,0.3)] hover:scale-102"
                >
                  <div className="min-w-0">
                    <p className="truncate font-bold text-pink-900">
                      {track.name}
                    </p>
                    <p className="truncate text-[10px] text-pink-700/80 font-medium">
                      {track.artists?.map((a) => a.name).join(", ")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-pink-600">
                      FAV
                    </span>
                  </div>
                </li>
              ))}

              {favorites.length > 6 && (
                <li className="rounded-lg border-2 border-pink-200/70 bg-white/60 px-3 py-2 text-center backdrop-blur-sm">
                  <p className="text-[10px] text-pink-800/80 font-bold">
                    + {favorites.length - 6} más en tu colección
                  </p>
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t-2 border-pink-300/50">
          <div className="text-[9px] text-pink-700/70 font-bold uppercase tracking-wider">
            Love Story
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-pink-400 shadow-[0_0_6px_rgba(236,72,153,0.8)]" />
            <div className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
            <div className="h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.8)]" />
          </div>
          <div className="text-[9px] text-pink-700/70 font-bold uppercase tracking-wider">
            Saved Hearts
          </div>
        </div>
      </div>
    </div>
  );
}

export default FavoritesWidget;