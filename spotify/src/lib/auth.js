// Generar string aleatorio para el parámetro 'state'
export function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Obtener automáticamente la URL base (localhost vs Vercel)
function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin; 
  }
  return process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:3000";
}

// Construir URL de autorización de Spotify
export function getSpotifyAuthUrl() {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

  if (!clientId) {
    console.error('ERROR: NEXT_PUBLIC_SPOTIFY_CLIENT_ID no está definido');
    throw new Error('Client ID no configurado');
  }

  // Usa el valor de env o calcula según el dominio actual
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || `${getBaseUrl()}/auth/callback`;

  const state = generateRandomString(16);

  // Guardar el state para validación posterior (prevenir CSRF)
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('spotify_auth_state', state);
  }

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
  if (typeof window === 'undefined') return;
  
  const expirationTime = Date.now() + expiresIn * 1000;
  localStorage.setItem('spotify_token', accessToken);
  localStorage.setItem('spotify_refresh_token', refreshToken);
  localStorage.setItem('spotify_token_expiration', expirationTime.toString());
}

// Obtener token actual (con verificación de expiración)
export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  
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
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('spotify_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expiration');
  sessionStorage.removeItem('spotify_auth_state');
}

// Refrescar token expirado
export async function refreshAccessToken() {
  if (typeof window === 'undefined') return null;
  
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  
  if (!refreshToken) {
    console.error('ERROR: No hay refresh token disponible');
    return null;
  }

  try {
    const response = await fetch('/api/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (!response.ok) {
      throw new Error('Error al refrescar token');
    }

    const data = await response.json();
    
    // Guardar nuevo access token
    const expirationTime = Date.now() + data.expires_in * 1000;
    localStorage.setItem('spotify_token', data.access_token);
    localStorage.setItem('spotify_token_expiration', expirationTime.toString());
    
    return data.access_token;
  } catch (error) {
    console.error('ERROR al refrescar token:', error);
    // Si falla el refresh, cerrar sesión
    logout();
    return null;
  }
}