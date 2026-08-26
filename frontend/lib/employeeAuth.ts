const EMPLOYEE_AUTH_KEY =
  "vaelis_employee_auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080";

// =========================================================
// EMPLOYEE PROFILE
// =========================================================

export type EmployeeProfile = {
  id: number;

  employeeCode: string;

  firstName: string;
  middleName: string | null;
  lastName: string;

  preferredName: string | null;

  dateOfBirth: string | null;

  gender: string | null;
  nationality: string | null;
  maritalStatus: string | null;

  primaryMobile: string | null;
  alternateMobile: string | null;

  personalEmail: string | null;
  officialEmail: string | null;

  designation: string | null;
  jobTitle: string | null;
  department: string | null;
  grade: string | null;

  branch: string | null;
  workLocation: string | null;
  workMode: string | null;

  employmentType: string | null;
  employmentStatus: string | null;

  dateOfJoining: string | null;

  profileStatus: string | null;
};

// =========================================================
// CREDENTIALS
// =========================================================

export function getEmployeeCredentials():
  string | null {

  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  return localStorage.getItem(
    EMPLOYEE_AUTH_KEY
  );
}

// =========================================================
// SET CREDENTIALS
// =========================================================

export function setEmployeeCredentials(
  credentials: string
): void {

  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  localStorage.setItem(
    EMPLOYEE_AUTH_KEY,
    credentials
  );
}

// =========================================================
// CLEAR CREDENTIALS
// =========================================================

export function clearEmployeeCredentials(): void {

  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  localStorage.removeItem(
    EMPLOYEE_AUTH_KEY
  );
}

// =========================================================
// AUTH HEADER
// =========================================================

export function getEmployeeAuthHeader():
  string | null {

  const credentials =
    getEmployeeCredentials();

  if (!credentials) {
    return null;
  }

  return `Basic ${credentials}`;
}

// =========================================================
// LOAD CURRENT EMPLOYEE
// =========================================================

export async function getEmployeeProfile():
  Promise<EmployeeProfile | null> {

  const authHeader =
    getEmployeeAuthHeader();

  if (!authHeader) {
    return null;
  }

  try {

    const response =
      await fetch(
        `${API_BASE_URL}/api/employee/me`,
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

    if (!response.ok) {
      return null;
    }

    return (
      await response.json()
    ) as EmployeeProfile;

  } catch (error) {

    console.error(
      "Unable to load employee profile:",
      error
    );

    return null;
  }
}