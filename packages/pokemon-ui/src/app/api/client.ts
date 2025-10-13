export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('pokemon_token_v1') || '';
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    credentials: 'include',
    ...init,
  });
  if (!res.ok) {
    if (res.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem('pokemon_token_v1');
      localStorage.removeItem('pokemon_auth_v1');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = data?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  try {
    return (await res.json()) as T;
  } catch {
    return undefined as unknown as T;
  }
}
