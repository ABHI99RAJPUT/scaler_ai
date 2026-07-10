const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

alert(API_BASE);

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------
const TOKEN_KEY = "route53_token";

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

/** Build headers that include the JWT Bearer token when available. */
function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

/** Generic fetch wrapper: throws on non-OK with the server's error detail. */
async function apiFetch(url: string, init: RequestInit = {}) {
  const res = await fetch(url, init);
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch { /* ignore */ }
    throw new Error(detail);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// API surface
// ---------------------------------------------------------------------------
export const api = {
  // --- Auth ------------------------------------------------------------------
  signup: async (data: { email: string; username: string; password: string }) =>
    apiFetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }),

  login: async (data: { username_or_email: string; password: string }) =>
    apiFetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }),

  getMe: async () =>
    apiFetch(`${API_BASE}/auth/me`, { headers: authHeaders() }),

  // --- Hosted Zones ----------------------------------------------------------
  getHostedZones: async (search = "") =>
    apiFetch(`${API_BASE}/hostedzone?search=${search}`, { headers: authHeaders() }),

  getHostedZone: async (id: string) =>
    apiFetch(`${API_BASE}/hostedzone/${id}`, { headers: authHeaders() }),

  createHostedZone: async (data: { name: string; type: string; comment: string }) =>
    apiFetch(`${API_BASE}/hostedzone`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }),

  deleteHostedZone: async (id: string) =>
    apiFetch(`${API_BASE}/hostedzone/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }),

  // --- DNS Records -----------------------------------------------------------
  getRecords: async (zoneId: string, search = "") =>
    apiFetch(`${API_BASE}/hostedzone/${zoneId}/rrset?search=${search}`, {
      headers: authHeaders(),
    }),

  createRecord: async (zoneId: string, data: any) =>
    apiFetch(`${API_BASE}/hostedzone/${zoneId}/rrset`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }),

  updateRecord: async (zoneId: string, recordId: string, data: any) =>
    apiFetch(`${API_BASE}/hostedzone/${zoneId}/rrset/${recordId}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }),

  deleteRecord: async (zoneId: string, recordId: string) =>
    apiFetch(`${API_BASE}/hostedzone/${zoneId}/rrset/${recordId}`, {
      method: "DELETE",
      headers: authHeaders(),
    }),
};
