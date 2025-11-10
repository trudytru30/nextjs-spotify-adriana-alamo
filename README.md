# 🎵 Spotify Taste Mixer - Proyecto Final

Aplicación web que genera playlists personalizadas de Spotify basándose en las preferencias musicales del usuario mediante widgets configurables.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Configuración Inicial](#configuración-inicial)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Autenticación OAuth](#autenticación-oauth)
- [Widgets a Implementar](#widgets-a-implementar)
- [API de Spotify](#api-de-spotify)
- [Criterios de Evaluación](#criterios-de-evaluación)
- [Recursos Útiles](#recursos-útiles)

---

## 🎯 Objetivos del Proyecto

1. Crear una aplicación profesional con Next.js
2. Implementar autenticación OAuth 2.0 de forma segura
3. Trabajar con APIs externas (Spotify Web API)
4. Desarrollar componentes React reutilizables
5. Gestionar estado y persistencia con localStorage
6. Crear una interfaz responsive y atractiva

---

## 📦 Requisitos Previos

### Software Necesario

- Node.js 18+ y npm/yarn
- Git
- Editor de código (VS Code recomendado)
- Cuenta de Spotify (gratuita o premium)

### Conocimientos Requeridos

- React básico (componentes, props, hooks)
- JavaScript ES6+
- CSS básico
- Conceptos de HTTP y APIs REST

---

## ⚙️ Configuración Inicial

### 1. Crear Aplicación en Spotify

1. Ve a [Spotify for Developers](https://developer.spotify.com/dashboard)
2. Inicia sesión con tu cuenta de Spotify
3. Haz clic en **"Create app"**
4. Completa el formulario:
   - **App name**: Spotify Taste Mixer
   - **App description**: Generador de playlists personalizadas
   - **Redirect URI**: `http://localhost:3000/auth/callback`
   - **API/SDKs**: Web API
5. Guarda tu **Client ID** y **Client Secret**

### 2. Crear Proyecto Next.js

```bash
npx create-next-app@latest spotify-taste-mixer
cd spotify-taste-mixer
```

Configuración recomendada:
- ✅ TypeScript: No (puedes usar Yes si lo prefieres)
- ✅ ESLint: Yes
- ✅ Tailwind CSS: Yes (recomendado)
- ✅ App Router: Yes
- ✅ Import alias: Yes (@/*)

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
SPOTIFY_CLIENT_ID=tu_client_id_aqui
SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
```

⚠️ **IMPORTANTE**: 
- Nunca subas `.env.local` a GitHub
- El archivo `.gitignore` ya lo excluye por defecto
- Solo las variables con `NEXT_PUBLIC_` son accesibles en el cliente

### 4. Instalar Dependencias (Opcional)

```bash
npm install axios
```

---

## 📁 Estructura del Proyecto

```
spotify-taste-mixer/
├── app/
│   ├── page.js                    # Página de inicio / login
│   ├── layout.js                  # Layout principal
│   ├── dashboard/
│   │   └── page.js                # Dashboard con widgets
│   ├── auth/
│   │   └── callback/
│   │       └── page.js            # Callback OAuth
│   └── api/
│       ├── spotify-token/
│       │   └── route.js           # Intercambio código por token
│       └── refresh-token/
│           └── route.js           # Refrescar token expirado
├── components/
│   ├── widgets/
│   │   ├── ArtistWidget.jsx       # Widget de artistas
│   │   ├── GenreWidget.jsx        # Widget de géneros
│   │   ├── DecadeWidget.jsx       # Widget de décadas
│   │   ├── MoodWidget.jsx         # Widget de mood/energía
│   │   └── PopularityWidget.jsx   # Widget de popularidad
│   ├── PlaylistDisplay.jsx        # Visualización de playlist
│   ├── TrackCard.jsx              # Tarjeta de canción
│   └── Header.jsx                 # Navegación y logout
├── lib/
│   ├── spotify.js                 # Funciones API Spotify
│   └── auth.js                    # Utilidades de autenticación
├── .env.local                     # Variables de entorno
└── README.md
```

---

## 🔐 Autenticación OAuth

### Flujo de Autenticación

```
Usuario → Login → Spotify OAuth → Callback → Token Exchange → Dashboard
```

### Código Proporcionado

#### 1. API Route: `app/api/spotify-token/route.js`

Este código **ya está proporcionado**. Cópialo tal cual:

```javascript
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Código no proporcionado' },
        { status: 400 }
      );
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

    // Intercambiar código por tokens
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error_description || 'Error al obtener token' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in
    });

  } catch (error) {
    console.error('Error en token exchange:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
```

#### 2. API Route: `app/api/refresh-token/route.js`

```javascript
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { refresh_token } = await request.json();

    if (!refresh_token) {
      return NextResponse.json(
        { error: 'Refresh token no proporcionado' },
        { status: 400 }
      );
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Error al refrescar token' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      access_token: data.access_token,
      expires_in: data.expires_in
    });

  } catch (error) {
    console.error('Error al refrescar token:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
```

#### 3. Utilidad de Auth: `lib/auth.js`

```javascript
// Generar string aleatorio para el parámetro 'state'
export function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Construir URL de autorización de Spotify
export function getSpotifyAuthUrl() {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '';
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || '';
  const state = generateRandomString(16);
  
  const scope = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'playlist-modify-public',
    'playlist-modify-private'
  ].join(' ');

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    state: state,
    scope: scope
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Guardar tokens en localStorage
export function saveTokens(accessToken, refreshToken, expiresIn) {
  const expirationTime = Date.now() + expiresIn * 1000;
  localStorage.setItem('spotify_token', accessToken);
  localStorage.setItem('spotify_refresh_token', refreshToken);
  localStorage.setItem('spotify_token_expiration', expirationTime.toString());
}

// Obtener token actual (con verificación de expiración)
export function getAccessToken() {
  const token = localStorage.getItem('spotify_token');
  const expiration = localStorage.getItem('spotify_token_expiration');
  
  if (!token || !expiration) return null;
  
  // Si el token expiró, retornar null
  if (Date.now() > parseInt(expiration)) {
    return null;
  }
  
  return token;
}

// Verificar si hay token válido
export function isAuthenticated() {
  return getAccessToken() !== null;
}

// Cerrar sesión
export function logout() {
  localStorage.removeItem('spotify_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expiration');
}
```

#### 4. Página de Login: `app/page.js`

```javascript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">🎵 Spotify Taste Mixer</h1>
        <p className="text-xl mb-8">Crea playlists personalizadas con tus preferencias musicales</p>
        <button
          onClick={handleLogin}
          className="bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition"
        >
          Iniciar sesión con Spotify
        </button>
      </div>
    </main>
  );
}
```

#### 5. Página de Callback: `app/auth/callback/page.js`

```javascript
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveTokens } from '@/lib/auth';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('Autenticación cancelada');
      return;
    }

    if (!code) {
      setError('No se recibió código de autorización');
      return;
    }

    // Intercambiar código por token
    exchangeCodeForToken(code);
  }, [searchParams]);

  const exchangeCodeForToken = async (code) => {
    try {
      const response = await fetch('/api/spotify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener token');
      }

      // Guardar tokens
      saveTokens(data.access_token, data.refresh_token, data.expires_in);

      // Redirigir al dashboard
      router.push('/dashboard');

    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Autenticando...</p>
      </div>
    </div>
  );
}
```

---

## 🧩 Widgets a Implementar

### Requisitos Generales para Widgets

Cada widget debe:
1. Ser un componente React independiente
2. Recibir props: `onSelect`, `selectedItems`
3. Emitir cambios al componente padre
4. Tener un diseño responsive
5. Mostrar estado de carga cuando haga peticiones

### Widget 1: Artist Widget (Obligatorio)

**Funcionalidad**: Buscar y seleccionar artistas favoritos

**API**: `GET https://api.spotify.com/v1/search?type=artist&q={query}&limit=10`

**Sugerencias**:
- Implementar debouncing en la búsqueda (esperar 500ms)
- Limitar a 5 artistas máximo
- Mostrar imagen del artista
- Permitir remover artistas seleccionados

### Widget 2: Genre Widget (Obligatorio)

**Funcionalidad**: Seleccionar géneros musicales

**API**: `GET https://api.spotify.com/v1/recommendations/available-genre-seeds`

⚠️ **Nota**: Este endpoint puede tener limitaciones. Alternativamente, puedes usar una lista predefinida de géneros comunes.

**Géneros sugeridos**:
```javascript
const COMMON_GENRES = [
  'rock', 'pop', 'jazz', 'electronic', 'hip-hop', 
  'classical', 'reggae', 'blues', 'country', 'metal',
  'indie', 'r-n-b', 'soul', 'funk', 'latin'
];
```

### Widget 3: Decade Widget (Obligatorio)

**Funcionalidad**: Seleccionar década(s) preferida(s)

**Implementación**: No requiere API, solo UI

**Décadas**: 1960s, 1970s, 1980s, 1990s, 2000s, 2010s, 2020s

**Uso**: Filtrar resultados por año de lanzamiento

### Widget 4: Track Widget (Opcional)

**Funcionalidad**: Buscar y seleccionar canciones específicas

**API**: `GET https://api.spotify.com/v1/search?type=track&q={query}&limit=10`

### Widget 5: Mood Widget (Opcional)

**Funcionalidad**: Ajustar energía, valencia (felicidad), acousticness

**Implementación**: Sliders que generan valores entre 0.0 y 1.0

### Widget 6: Popularity Widget (Opcional)

**Funcionalidad**: Elegir entre mainstream y underground

**Implementación**: Slider que controla el rango de popularidad (0-100)

---

## 🎵 Generación de Playlist

### Algoritmo Sugerido

Como el endpoint `/recommendations` está deprecado, usa este enfoque:

1. **Punto de partida**: Usa los artistas/tracks seleccionados
2. **Búsqueda**: Realiza búsquedas basadas en los géneros seleccionados
3. **Filtrado**: Aplica filtros de década y popularidad
4. **Top tracks**: Obtén top tracks de los artistas seleccionados
5. **Combinación**: Mezcla resultados y elimina duplicados

### Ejemplo de Implementación

```javascript
// lib/spotify.js
export async function generatePlaylist(preferences) {
  const { artists, genres, decades, popularity } = preferences;
  const token = getAccessToken();
  let allTracks = [];

  // 1. Obtener top tracks de artistas seleccionados
  for (const artist of artists) {
    const tracks = await fetch(
      `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await tracks.json();
    allTracks.push(...data.tracks);
  }

  // 2. Buscar por géneros
  for (const genre of genres) {
    const results = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=genre:${genre}&limit=20`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await results.json();
    allTracks.push(...data.tracks.items);
  }

  // 3. Filtrar por década
  if (decades.length > 0) {
    allTracks = allTracks.filter(track => {
      const year = new Date(track.album.release_date).getFullYear();
      return decades.some(decade => {
        const decadeStart = parseInt(decade);
        return year >= decadeStart && year < decadeStart + 10;
      });
    });
  }

  // 4. Filtrar por popularidad
  if (popularity) {
    const [min, max] = popularity;
    allTracks = allTracks.filter(
      track => track.popularity >= min && track.popularity <= max
    );
  }

  // 5. Eliminar duplicados y limitar a 30 canciones
  const uniqueTracks = Array.from(
    new Map(allTracks.map(track => [track.id, track])).values()
  ).slice(0, 30);

  return uniqueTracks;
}
```

---

## 📡 API de Spotify - Referencia Rápida

### Headers Requeridos

```javascript
const headers = {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
};
```

### Endpoints Principales

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/me` | GET | Obtener perfil del usuario |
| `/search` | GET | Buscar artistas/tracks/albums |
| `/artists/{id}/top-tracks` | GET | Top tracks de un artista |
| `/me/top/artists` | GET | Artistas más escuchados |
| `/me/top/tracks` | GET | Canciones más escuchadas |
| `/users/{user_id}/playlists` | POST | Crear playlist |
| `/playlists/{playlist_id}/tracks` | POST | Añadir canciones a playlist |

### Ejemplos de Búsqueda

```javascript
// Buscar artistas
const url = `https://api.spotify.com/v1/search?type=artist&q=radiohead&limit=5`;

// Buscar tracks
const url = `https://api.spotify.com/v1/search?type=track&q=bohemian%20rhapsody&limit=10`;

// Buscar por género (limitado)
const url = `https://api.spotify.com/v1/search?type=track&q=genre:jazz&limit=20`;
```

### Manejo de Errores

```javascript
async function spotifyRequest(url) {
  const token = getAccessToken();
  
  if (!token) {
    // Intentar refrescar token
    const newToken = await refreshAccessToken();
    if (!newToken) {
      // Redirigir a login
      window.location.href = '/';
      return;
    }
  }

  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (response.status === 401) {
    // Token expirado, refrescar
    const newToken = await refreshAccessToken();
    // Reintentar petición
  }

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
```

---

## 🎯 Criterios de Evaluación

### Funcionalidad (60%)

- **Autenticación OAuth (15%)**: Login, callback y manejo de tokens
- **Widgets (25%)**: Mínimo 3 widgets funcionando correctamente
- **Generación de Playlist (15%)**: Algoritmo que combine preferencias
- **Interacción (5%)**: Remover tracks, marcar favoritos

### Código y Buenas Prácticas (20%)

- Componentes bien estructurados y reutilizables
- Código limpio y comentado
- Manejo de errores apropiado
- Variables de entorno configuradas correctamente

### UI/UX (15%)

- Diseño responsive (móvil, tablet, desktop)
- Estados de carga visibles
- Mensajes de error claros
- Interfaz intuitiva y atractiva

### Extras (5%)

- Funcionalidades adicionales (guardar en Spotify, historial, etc.)
- Animaciones y transiciones
- Tests básicos
- Deploy en Vercel

---

## 🚀 Pasos para Desarrollar

### Semana 1: Setup y Autenticación

1. Crear proyecto y configurar variables de entorno
2. Implementar flujo OAuth completo
3. Crear página de dashboard básica
4. Probar que puedas obtener información del usuario

### Semana 2: Widgets Básicos

1. Implementar Artist Widget con búsqueda
2. Implementar Genre Widget
3. Implementar Decade Widget
4. Crear componente para mostrar selecciones

### Semana 3: Generación y Visualización

1. Implementar algoritmo de generación de playlist
2. Crear componente PlaylistDisplay
3. Añadir funcionalidad para remover tracks
4. Implementar refresh de playlist

### Semana 4: Refinamiento y Extras

1. Mejorar UI/UX y responsive design
2. Añadir funcionalidades opcionales
3. Optimizar y limpiar código
4. Testing y corrección de bugs

---

## 🐛 Problemas Comunes y Soluciones

### Error: "Invalid client"

**Problema**: Client ID o Client Secret incorrectos

**Solución**: Verifica `.env.local` y reinicia el servidor de desarrollo

### Error: "Invalid redirect URI"

**Problema**: La URI de callback no coincide con la configurada en Spotify

**Solución**: Asegúrate que en el dashboard de Spotify esté `http://localhost:3000/auth/callback`

### Error: "The access token expired"

**Problema**: Token expirado (válido por 1 hora)

**Solución**: Implementa refresh token automático:

```javascript
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  
  const response = await fetch('/api/refresh-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });

  const data = await response.json();
  
  localStorage.setItem('spotify_token', data.access_token);
  const expirationTime = Date.now() + data.expires_in * 1000;
  localStorage.setItem('spotify_token_expiration', expirationTime.toString());
  
  return data.access_token;
}
```

### localStorage is not defined

**Problema**: Intentando usar localStorage en componente de servidor

**Solución**: Añade `'use client'` al inicio del archivo del componente

### CORS Error

**Problema**: Peticiones bloqueadas por CORS

**Solución**: Usa API Routes para peticiones sensibles, o asegúrate de incluir el token correctamente

---

## 📚 Recursos Útiles

### Documentación Oficial

- [Next.js Documentation](https://nextjs.org/docs)
- [Spotify Web API Reference](https://developer.spotify.com/documentation/web-api)
- [Spotify OAuth Guide](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)
- [React Hooks](https://react.dev/reference/react)

### Tutoriales Recomendados

- [Next.js App Router Tutorial](https://nextjs.org/learn)
- [OAuth 2.0 Explained](https://auth0.com/docs/get-started/authentication-and-authorization-flow)
- [Tailwind CSS Tutorial](https://tailwindcss.com/docs)

### Herramientas de Desarrollo

- [Postman](https://www.postman.com/) - Para probar endpoints de Spotify
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [Spotify API Console](https://developer.spotify.com/console/) - Para probar peticiones

---

## 🎨 Inspiración de Diseño

### Referencias de UI

- [Spotify Design](https://spotify.design/)
- [Dribbble - Music Apps](https://dribbble.com/search/music-app)
- [Awwwards - Music Websites](https://www.awwwards.com/websites/music/)

### Paletas de Colores Sugeridas

```css
/* Spotify Inspired */
--primary: #1DB954;
--secondary: #191414;
--accent: #1ed760;

/* Dark Mode */
--bg-dark: #121212;
--bg-card: #181818;
--text-primary: #FFFFFF;
--text-secondary: #B3B3B3;
```

---

## 📤 Entrega del Proyecto

### Antes de Entregar

- [ ] Código limpio y comentado
- [ ] README.md con instrucciones de instalación
- [ ] .env.example con variables necesarias (sin valores reales)
- [ ] Todas las dependencias en package.json
- [ ] Proyecto funciona en localhost
- [ ] Screenshots o video demo

### Formato de Entrega

1. Repositorio GitHub (público o privado con acceso al profesor)
2. README con instrucciones claras de instalación
3. Video demo de 2-3 minutos mostrando funcionalidades
4. (Opcional) Deploy en Vercel con URL funcionando

---

## 💡 Ideas para Mejorar la Nota

### Funcionalidades Extra (+1 punto c/u, máx 5)

1. **Guardar playlist en Spotify**: Implementar guardado real
2. **Historial de playlists**: Guardar playlists generadas anteriormente
3. **Compartir playlist**: Generar link para compartir
4. **Modo oscuro/claro**: Toggle entre temas
5. **Estadísticas**: Mostrar insights sobre la música generada
6. **Preview de canciones**: Reproducir fragmentos de 30s
7. **Drag & Drop**: Reordenar canciones de la playlist
8. **Exportar**: Descargar playlist como JSON/CSV
9. **Filtros avanzados**: Tempo, acousticness, danceability
10. **Tests unitarios**: Jest + React Testing Library

---

## 🤝 Soporte

Si tienes dudas:

1. Revisa este README completo
2. Consulta la documentación oficial de Spotify y Next.js
3. Usa el foro del curso
4. Pregunta al profesor en horario de consultas

---

## 📝 Notas Finales

- **Tiempo estimado**: 30-40 horas
- **Dificultad**: Media-Alta
- **Este es un proyecto real** que puedes incluir en tu portfolio
- **No copies código sin entenderlo**: asegúrate de comprender cada parte
- **Empieza temprano**: el OAuth puede tomar tiempo en configurarse
- **Prueba frecuentemente**: no esperes al final para probar la integración

---

¡Buena suerte y disfruta creando tu Spotify Taste Mixer! 🎉🎵