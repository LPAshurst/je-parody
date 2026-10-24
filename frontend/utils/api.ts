// Dev: "/api" (Vite proxy). Prod: set VITE_API_BASE=https://ngrok-free.dev
export const API_BASE: string = import.meta.env.VITE_API_BASE ?? "/api";

// 🔧 FIX: Correctly determine the backend socket target
export const SOCKET_URL: string = (() => {
  // If API_BASE is an absolute URL (Production / Ngrok)
  if (API_BASE.startsWith("http://") || API_BASE.startsWith("https://")) {
    return new URL(API_BASE).origin;
  }
  
  // If API_BASE is a relative path (Local Dev via Vite Proxy)
  // We cannot use window.location.origin here because the backend lives on a different port!
  // Fall back to your explicit local Raspberry Pi / Rust backend address:
  return "http://192.168.1.104:3000"; 
})();


export function apiFetch(path: string, init: RequestInit = {}, includeCreds=true) {
  const headers = new Headers(init.headers);
  headers.set("ngrok-skip-browser-warning", "true");   // skips ngrok's interstitial page
  const creds = includeCreds ? "include" : undefined;
  return fetch(`${path}`, {                 // prepends the base URL
     credentials: creds,                        // sends your session cookie
    ...init,
    headers,
  });
}