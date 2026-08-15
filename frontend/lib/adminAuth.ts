const ADMIN_AUTH_KEY = "vaelis_admin_auth";

export function getAdminCredentials(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(ADMIN_AUTH_KEY);
}

export function setAdminCredentials(
  credentials: string
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    ADMIN_AUTH_KEY,
    credentials
  );
}

export function clearAdminCredentials(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    ADMIN_AUTH_KEY
  );
}

export function getAdminAuthHeader():
  | string
  | null {

  const credentials =
    getAdminCredentials();

  if (!credentials) {
    return null;
  }

  return `Basic ${credentials}`;
}