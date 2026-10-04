/* ==========================================================
   TRAZZO · Lógica PWA (sin dependencias)
   1. Registro del service worker y aviso de actualización
   2. Botón "Instalar" (Chrome/Edge/Samsung Internet/Opera en Android, Windows, macOS, Linux, ChromeOS)
   3. Instrucciones para iOS/iPadOS (Safari) y Safari en macOS
   4. Aviso de conexión / sin conexión
   ========================================================== */
(() => {
  const $ = id => document.getElementById(id);
  const banner = $('pwaBanner');
  const bannerText = $('pwaBannerText');
  const installBtn = $('pwaInstall');
  const dismissBtn = $('pwaDismiss');
  const footerInstall = $('pwaFooterInstall');
  const toast = $('pwaToast');
  const toastText = $('pwaToastText');
  const toastAction = $('pwaToastAction');

  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isMacSafari = /Macintosh/.test(ua) && /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox/.test(ua) && !isIOS;
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches
    || window.matchMedia('(display-mode: window-controls-overlay)').matches
    || navigator.standalone === true;

  // Recordar si el usuario cerró el aviso (solo conveniencia; si falla el storage no pasa nada)
  const DISMISS_KEY = 'trazzo-install-dismissed';
  const wasDismissed = () => { try { return sessionStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; } };
  const rememberDismiss = () => { try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* sin storage */ } };

  /* ---------- 1. Service worker ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' }).then(reg => {
        // Ya había una versión nueva esperando
        if (reg.waiting && navigator.serviceWorker.controller) offerUpdate(reg.waiting);
        reg.addEventListener('updatefound', () => {
          const sw = reg.installing;
          sw && sw.addEventListener('statechange', () => {
            if (sw.state === 'installed' && navigator.serviceWorker.controller) offerUpdate(sw);
          });
        });
      }).catch(err => console.warn('[Trazzo] No se pudo registrar el service worker:', err));

      let reloading = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (reloading) return;
        reloading = true;
        location.reload();
      });
    });
  }

  function offerUpdate(worker) {
    showToast('Hay una nueva versión de Trazzo disponible.', 'Actualizar', () => worker.postMessage('SKIP_WAITING'));
  }

  /* ---------- 2. Instalación (navegadores Chromium) ---------- */
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();               // usamos nuestro propio botón
    deferredPrompt = event;
    footerInstall.hidden = false;
    if (!wasDismissed()) showBanner('Acceso directo, pantalla completa y uso sin conexión.', true);
  });

  async function install() {
    if (!deferredPrompt) return;
    hideBanner();
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    if (outcome !== 'accepted') footerInstall.hidden = false;
  }

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hideBanner();
    footerInstall.hidden = true;
    showToast('Trazzo se instaló correctamente.');
  });

  installBtn.addEventListener('click', install);
  footerInstall.addEventListener('click', () => {
    if (deferredPrompt) install();
    else if (isIOS || isMacSafari) showManualHint(true);
  });
  dismissBtn.addEventListener('click', () => { rememberDismiss(); hideBanner(); });

  /* ---------- 3. iOS / Safari: instalación manual ---------- */
  function showManualHint(force) {
    if (isStandalone() || (!force && wasDismissed())) return;
    footerInstall.hidden = false;
    if (isIOS) showBanner('En Safari toca Compartir ⎋ y luego «Agregar a inicio».', false);
    else if (isMacSafari) showBanner('En Safari abre Archivo › «Agregar al Dock».', false);
  }
  if (isIOS || isMacSafari) window.addEventListener('load', () => setTimeout(() => showManualHint(false), 1500));

  /* ---------- Banner y toast ---------- */
  function showBanner(text, canPrompt) {
    if (isStandalone()) return;
    bannerText.textContent = text;
    installBtn.hidden = !canPrompt;
    banner.hidden = false;
  }
  function hideBanner() { banner.hidden = true; }

  let toastTimer;
  function showToast(text, actionLabel, onAction) {
    clearTimeout(toastTimer);
    toastText.textContent = text;
    toastAction.hidden = !actionLabel;
    toastAction.textContent = actionLabel || '';
    toastAction.onclick = onAction || null;
    toast.hidden = false;
    if (!actionLabel) toastTimer = setTimeout(() => { toast.hidden = true; }, 4000);
  }

  /* ---------- 4. Conexión ---------- */
  window.addEventListener('offline', () => showToast('Sin conexión: sigues trabajando con la versión guardada.'));
  window.addEventListener('online', () => showToast('Conexión restablecida.'));

  // Marca el modo de visualización para estilos o depuración
  document.documentElement.dataset.displayMode = isStandalone() ? 'standalone' : 'browser';
})();
