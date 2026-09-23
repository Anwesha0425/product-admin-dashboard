// Token helpers - keeps auth logic in one place
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  // Also set a cookie so middleware can check auth on the server side
  document.cookie = `auth_token=${token}; path=/; max-age=3600; SameSite=Lax`;
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  // Clear the cookie too
  document.cookie = 'auth_token=; path=/; max-age=0';
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function getStoredUser(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(USER_KEY);
}

export function setStoredUser(data: object): void {
  localStorage.setItem(USER_KEY, JSON.stringify(data));
}