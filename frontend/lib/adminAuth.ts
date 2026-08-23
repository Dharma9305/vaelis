const ADMIN_AUTH_KEY = "vaelis_admin_auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080";

// =========================================================
// ADMIN PERMISSION
// =========================================================

export type AdminPermission = {
  id: number;
  code: string;
  name: string;
  description: string;
  enabled: boolean;
};

// =========================================================
// ADMIN PROFILE
// =========================================================

export type AdminProfile = {
  username: string;

  role:
    | "ADMIN"
    | "SUPER_ADMIN"
    | "ACCOUNT_MANAGER";

  permissions: string[];
};

// =========================================================
// API PROFILE RESPONSE
// =========================================================

type AdminProfileResponse = {
  username: string;

  role:
    | "ADMIN"
    | "SUPER_ADMIN"
    | "ACCOUNT_MANAGER";

  permissions?: string[];
};

// =========================================================
// BASIC AUTH CREDENTIALS
// =========================================================

export function getAdminCredentials(): string | null {

  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  return localStorage.getItem(
    ADMIN_AUTH_KEY
  );
}

// =========================================================
// SET CREDENTIALS
// =========================================================

export function setAdminCredentials(
  credentials: string
): void {

  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  localStorage.setItem(
    ADMIN_AUTH_KEY,
    credentials
  );
}

// =========================================================
// CLEAR CREDENTIALS
// =========================================================

export function clearAdminCredentials(): void {

  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  localStorage.removeItem(
    ADMIN_AUTH_KEY
  );
}

// =========================================================
// AUTH HEADER
// =========================================================

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

// =========================================================
// ADMIN PROFILE
// =========================================================

export async function getAdminProfile():
  Promise<AdminProfile | null> {

  const authHeader =
    getAdminAuthHeader();

  if (!authHeader) {
    return null;
  }

  try {

    // =====================================================
    // LOAD PROFILE
    // =====================================================

    const profileResponse =
      await fetch(
        `${API_BASE_URL}/api/admin/me`,
        {
          method: "GET",

          headers: {
            Authorization:
              authHeader,

            Accept:
              "application/json",
          },

          cache:
            "no-store",
        }
      );

    // =====================================================
    // AUTHENTICATION FAILED
    // =====================================================

    if (
      !profileResponse.ok
    ) {
      return null;
    }

    // =====================================================
    // PARSE PROFILE
    // =====================================================

    const profile =
      (await profileResponse.json()) as
        AdminProfileResponse;

    // =====================================================
    // VALIDATE ROLE
    // =====================================================

    if (
      profile.role !== "ADMIN" &&
      profile.role !== "SUPER_ADMIN" &&
      profile.role !== "ACCOUNT_MANAGER"
    ) {

      return null;
    }

    // =====================================================
    // PERMISSIONS
    //
    // /api/admin/me already returns the permissions
    // for the authenticated user.
    //
    // Do NOT make another /api/admin/permissions request.
    // =====================================================

    const permissions: string[] =
      Array.isArray(
        profile.permissions
      )
        ? profile.permissions
        : [];

    // =====================================================
    // SUPER ADMIN
    //
    // SUPER_ADMIN automatically has full access.
    // =====================================================

    if (
      profile.role ===
      "SUPER_ADMIN"
    ) {

      return {
        username:
          profile.username,

        role:
          profile.role,

        permissions: [],
      };
    }

    // =====================================================
    // NORMAL ADMIN / ACCOUNT MANAGER
    // =====================================================

    return {
      username:
        profile.username,

      role:
        profile.role,

      permissions,
    };

  } catch (error) {

    console.error(
      "Unable to load admin profile:",
      error
    );

    return null;
  }
}

// =========================================================
// PERMISSION CHECK
// =========================================================

export function hasAdminPermission(
  profile:
    | AdminProfile
    | null,

  permission:
    string
): boolean {

  if (!profile) {
    return false;
  }

  // =======================================================
  // SUPER ADMIN HAS FULL ACCESS
  // =======================================================

  if (
    profile.role ===
    "SUPER_ADMIN"
  ) {
    return true;
  }

  // =======================================================
  // NORMAL ADMIN / ACCOUNT MANAGER
  // =======================================================

  return profile.permissions.includes(
    permission
  );
}

// =========================================================
// MULTIPLE PERMISSION CHECK
// =========================================================

export function hasAnyAdminPermission(
  profile:
    | AdminProfile
    | null,

  permissionCodes:
    string[]
): boolean {

  if (!profile) {
    return false;
  }

  if (
    profile.role ===
    "SUPER_ADMIN"
  ) {
    return true;
  }

  return permissionCodes.some(
    (code) =>
      hasAdminPermission(
        profile,
        code
      )
  );
}

// =========================================================
// REQUIRED PERMISSION CHECK
// =========================================================

export function requireAdminPermission(
  profile:
    | AdminProfile
    | null,

  permissionCode:
    string
): void {

  if (
    !hasAdminPermission(
      profile,
      permissionCode
    )
  ) {

    throw new Error(
      `Missing admin permission: ${permissionCode}`
    );
  }
}

// =========================================================
// SUPER ADMIN CHECK
// =========================================================

export async function isSuperAdmin():
  Promise<boolean> {

  const profile =
    await getAdminProfile();

  return (
    profile?.role ===
    "SUPER_ADMIN"
  );
}