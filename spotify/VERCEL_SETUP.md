# Configuración para Vercel

Este documento explica cómo desplegar el proyecto Spotify Taste Mixer en Vercel.

## Pasos para el despliegue

### 1. Preparar tu aplicación de Spotify

1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crea una nueva aplicación o usa una existente
3. Anota el **Client ID** y **Client Secret**
4. En "Edit Settings", añade las siguientes Redirect URIs:
   - Para producción: `https://nextjs-spotify-adriana-alamo.vercel.app/auth/callback`
   - Para desarrollo: `http://localhost:3000/auth/callback`

### 2. Configurar variables de entorno en Vercel

1. Ve a tu proyecto en Vercel
2. Navega a **Settings** → **Environment Variables**
3. Añade las siguientes variables:

```
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=tu_client_id
SPOTIFY_CLIENT_SECRET=tu_client_secret
NEXT_PUBLIC_REDIRECT_URI=https://nextjs-spotify-adriana-alamo.vercel.app/auth/callback
```

**IMPORTANTE:**
- El `SPOTIFY_CLIENT_SECRET` debe estar en las variables de entorno, NO en el código
- Usa el mismo `REDIRECT_URI` que configuraste en Spotify Developer Dashboard

### 3. Desplegar en Vercel

#### Opción A: Desde la interfaz web de Vercel
1. Importa tu repositorio de GitHub
2. Vercel detectará automáticamente que es un proyecto Next.js
3. El directorio raíz debe ser `/spotify`
4. Haz clic en "Deploy"

#### Opción B: Desde la línea de comandos
```bash
# Instala Vercel CLI si no la tienes
npm i -g vercel

# Desde el directorio del proyecto
cd spotify
vercel

# Sigue las instrucciones en pantalla
```

### 4. Configuración del proyecto en Vercel

Si el proyecto Next.js está en una subcarpeta (como `spotify/`), asegúrate de configurar:
- **Root Directory**: `spotify`

### 5. Verificar el despliegue

1. Una vez desplegado, verifica que la URL de producción coincida con la configurada en Spotify
2. Prueba el flujo de autenticación completo
3. Si hay errores, revisa los logs en el dashboard de Vercel

## Solución de problemas

### Error de redirección
- Verifica que la `REDIRECT_URI` en Vercel sea exactamente igual a la configurada en Spotify Dashboard
- La URL debe incluir el protocolo `https://`

### Error de autenticación
- Verifica que todas las variables de entorno estén configuradas correctamente
- El `CLIENT_SECRET` no debe tener espacios extra al inicio o final

### Error 401 o 403
- Verifica que el `CLIENT_ID` y `CLIENT_SECRET` sean correctos
- Asegúrate de que tu aplicación de Spotify esté en modo "Development" o "Extended Quota Mode"

## Variables de entorno necesarias

Ver el archivo `.env.example` para una lista completa de las variables de entorno requeridas.

---

## Desarrollo local

Si quieres trabajar en tu máquina local antes de desplegar a Vercel:

### 1. Configurar Spotify para desarrollo local

En tu aplicación de Spotify Dashboard, añade esta Redirect URI adicional:
```
http://localhost:3000/auth/callback
```

### 2. Crear archivo .env.local

Copia el archivo `.env.local.example` como `.env.local`:

```bash
cp .env.local.example .env.local
```

Luego edita `.env.local` con tus credenciales:

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=tu_client_id_real
SPOTIFY_CLIENT_SECRET=tu_client_secret_real
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
```

**IMPORTANTE:** El archivo `.env.local` está en `.gitignore` y NO se subirá a GitHub (por seguridad).

### 3. Instalar dependencias y ejecutar

```bash
cd spotify
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 4. Alternar entre local y producción

- Para **desarrollo local**: usa `.env.local` con `http://localhost:3000/auth/callback`
- Para **producción en Vercel**: configura las variables de entorno en Vercel con `https://nextjs-spotify-adriana-alamo.vercel.app/auth/callback`

Next.js automáticamente prioriza `.env.local` sobre `.env` cuando existe.
