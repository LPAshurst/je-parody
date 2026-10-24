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


export function apiFetch(path: string, init: RequestInit = {}, includeCreds = true) {
  const headers = new Headers(init.headers);
  const creds = includeCreds ? "include" : undefined;

  let finalUrl = `${path}`;
    //fart//fart
  // 🔧 FIX: Bypass ngrok warning using a query parameter for GET requests
  // This avoids adding a custom header that forces a CORS preflight failure!
  if (!init.method || init.method.toUpperCase() === "GET") {
    const urlObj = new URL(finalUrl, window.location.origin);
    urlObj.searchParams.set("ngrok-skip-browser-warning", "true");
    finalUrl = urlObj.toString();
  } else {
    // For POST/PUT etc, you can keep the header if your CORS middleware allows it
    headers.set("ngrok-skip-browser-warning", "true");
  }

  return fetch(finalUrl, {                 
    credentials: creds,                        
    ...init,
    headers,
  });
}
