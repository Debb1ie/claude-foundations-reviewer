// Cross-browser fullscreen helpers used to make the Advanced Practice mode
// harder to run alongside a browser extension side panel or a second
// monitor showing an AI assistant -- fullscreen hides browser chrome
// (address bar, extension toolbar, most side panels) while active.

type FullscreenDoc = Document & {
  webkitExitFullscreen?: () => Promise<void>;
  webkitFullscreenElement?: Element | null;
  mozCancelFullScreen?: () => Promise<void>;
  mozFullScreenElement?: Element | null;
  msExitFullscreen?: () => Promise<void>;
  msFullscreenElement?: Element | null;
};

type FullscreenEl = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
};

export function requestAppFullscreen() {
  if (typeof document === 'undefined') return;
  const el = document.documentElement as FullscreenEl;
  const request =
    el.requestFullscreen?.bind(el) ||
    el.webkitRequestFullscreen?.bind(el) ||
    el.mozRequestFullScreen?.bind(el) ||
    el.msRequestFullscreen?.bind(el);
  request?.()?.catch(() => {
    // Fullscreen can be denied (e.g. iOS Safari, or no user-gesture);
    // the tab-switch/blur detection still covers this case.
  });
}

export function isAppFullscreen(): boolean {
  if (typeof document === 'undefined') return false;
  const doc = document as FullscreenDoc;
  return Boolean(
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement
  );
}
