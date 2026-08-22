const ADMIN_AUTH_KEY = "vaelis_admin_auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080";

// =========================================================
// ADMIN PERMISSIONS
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
  role: "ADMIN" | "SUPER_ADMIN";
  permissions: string[];
};

// =========================================================
// BASIC AUTH CREDENTIALS
// =========================================================

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
    // LOAD BASIC ADMIN PROFILE
    // =====================================================

    const profileResponse =
      await fetch(
        `${API_BASE_URL}/api/admin/me`,
        {
          method: "GET",

          headers: {
            Authorization: authHeader,
            Accept: "application/json",
          },

          cache: "no-store",
        }
      );

    // =====================================================
    // AUTHENTICATION FAILED
    // =====================================================

    if (!profileResponse.ok) {
      return null;
    }

    const profile =
      await profileResponse.json();

    // =====================================================
    // VALIDATE ROLE
    // =====================================================

    if (
      profile?.role !== "ADMIN" &&
      profile?.role !== "SUPER_ADMIN"
    ) {
      return null;
    }

    // =====================================================
    // SUPER ADMIN
    //
    // SUPER_ADMIN automatically has full access.
    // We don't need to request individual permissions.
    // =====================================================

    if (
      profile.role === "SUPER_ADMIN"
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
    // ADMIN PERMISSIONS
    //
    // IMPORTANT:
    // The endpoint is protected by SUPER_ADMIN on backend.
    // Therefore a normal ADMIN will receive 403 here.
    //
    // We will NOT treat that as authentication failure.
    // Instead, permissions will be loaded through the
    // admin-specific permission endpoint when available.
    // =====================================================

   let permissions:
  string[] = [];

    try {

      const permissionsResponse =
        await fetch(
          `${API_BASE_URL}/api/admin/permissions`,
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

      if (
  permissionsResponse.ok
) {

  const data =
    await permissionsResponse.json();

  if (
    Array.isArray(data)
  ) {

    permissions =
      data
        .filter(
          (
            permission
          ) =>
            permission &&
            permission.enabled !== false
        )
        .map(
          (
            permission
          ) =>
            permission.code
        )
        .filter(
          (
            code
          ): code is string =>
            typeof code ===
            "string"
        );
  }
}

    } catch (permissionError) {

      console.error(
        "Unable to load admin permissions:",
        permissionError
      );
    }

    // =====================================================
    // RETURN ADMIN PROFILE
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
  profile: AdminProfile | null,
  permission: string
): boolean {
  if (!profile) {
    return false;
  }

  // =======================================================
  // SUPER ADMIN HAS FULL ACCESS
  // =======================================================

  if (profile.role === "SUPER_ADMIN") {
    return true;
  }

  // =======================================================
  // NORMAL ADMIN
  // =======================================================

  return profile.permissions.includes(
    permission
  );
}
// =========================================================
// MULTIPLE PERMISSION CHECK
// =========================================================

export function hasAnyAdminPermission(
  profile: AdminProfile | null,
  permissionCodes: string[]
): boolean {

  if (!profile) {
    return false;
  }

  if (
    profile.role === "SUPER_ADMIN"
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
  profile: AdminProfile | null,
  permissionCode: string
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