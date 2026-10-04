# PWA · Trazzo

Aplicación web progresiva (PWA) del sistema **Trazzo**, gestión logística y transporte de mercancías.
Frontend en HTML y CSS con navegación por `:target`. Por ahora no tiene backend: los datos son de demostración.

## Estructura

```
PWA/
├── index.html          # Maquetado V1 (Material) + etiquetas PWA
├── manifest.json       # Manifest de la app web (nombre, colores, íconos, accesos directos, capturas)
├── sw.js               # Service worker: caché del app shell y modo sin conexión
├── js/pwa.js           # Registro del SW, botón "Instalar", aviso para iOS, avisos de conexión/actualización
├── favicon.ico         # 16, 32 y 48 px
├── icons/              # Logo (SVG), íconos 16–512 px, maskable, apple-touch-icon y accesos directos
└── screenshots/        # Capturas para el diálogo de instalación (escritorio y celular)
```

## Ejecutar en la computadora

Una PWA necesita servirse por `http://localhost` o por `https://`; abrir el archivo con doble clic no registra el service worker.

```bash
npx http-server . -p 8080 -c-1
```

Abre `http://localhost:8080`. En Chrome o Edge aparece el botón de instalar en la barra de direcciones y el aviso **Instala Trazzo**.

### Verlo en DevTools (F12)

1. F12 → pestaña **Application** (Aplicación).
2. **Manifest**: nombre, colores, íconos (incluye el logo), accesos directos y capturas.
3. **Service workers**: `sw.js` activo, con la opción *Offline* para probar sin conexión.
4. **Cache storage**: cachés `trazzo-v1.0.0-shell` y `trazzo-v1.0.0-runtime`.

## Publicar con GitHub Pages (HTTPS, necesario en celular)

1. En GitHub: **Settings → Pages**.
2. *Source*: **Deploy from a branch** · *Branch*: **main** · carpeta **/ (root)** → **Save**.
3. Espera 1–2 minutos. La app queda en `https://user11checo.github.io/PWA/`.

## Instalar en cada dispositivo

| Dispositivo | Navegador | Cómo instalar |
|---|---|---|
| Android | Chrome, Edge, Samsung Internet | Toca **Instalar** en el aviso, o menú ⋮ → **Instalar aplicación** |
| iPhone / iPad | Safari | Compartir → **Agregar a inicio** |
| Windows / Linux / ChromeOS | Chrome, Edge | Ícono de instalar en la barra de direcciones, o el aviso **Instalar** |
| macOS | Chrome, Edge | Ícono de instalar en la barra de direcciones |
| macOS (Sonoma o posterior) | Safari | Archivo → **Agregar al Dock** |

Una vez instalada, la app abre en su propia ventana con el logo de Trazzo como ícono y funciona sin conexión.

## Actualizar la app

Al cambiar archivos, sube la versión en `sw.js` (`const VERSION = 'trazzo-v1.0.1'`). Los usuarios verán el aviso **Hay una nueva versión** con el botón **Actualizar**.
