"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";

import {
  getAdminProfile,
  getAdminCredentials,
  getAdminAuthHeader,
  hasAdminPermission,
  type AdminProfile,
} from "@/lib/adminAuth";

import API_BASE_URL from "@/lib/api";

/* =========================================================
   TYPES
========================================================= */

type Employee = {
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

type LifecycleHistory = {
  id: number;
  employeeId: number;

  eventType: string;

  previousStatus: string | null;
  newStatus: string | null;

  previousDepartment: string | null;
  newDepartment: string | null;

  previousDesignation: string | null;
  newDesignation: string | null;

  previousReportingManagerId: number | null;
  newReportingManagerId: number | null;

  previousFunctionalManagerId: number | null;
  newFunctionalManagerId: number | null;

  changedBy: string | null;
  changedByRole: string | null;

  reason: string | null;
  remarks: string | null;

  effectiveDate: string | null;
  createdAt: string | null;
};

type EmployeeAddress = {
  id: number;

  addressType: string;

  addressLine1: string;
  addressLine2: string | null;

  landmark: string | null;

  city: string;
  state: string;

  district: string | null;

  country: string;
  postalCode: string;

  contactMobile: string | null;

  active: boolean;
};

type EmployeeEducation = {
  id: number;

  employeeId: number;

  educationLevel: string;

  qualification: string;

  specialization: string | null;

  institution: string;

  universityOrBoard: string | null;

  startYear: number | null;

  completionYear: number | null;

  gradingType: string | null;

  gradeOrPercentage: string | null;

  registrationNumber: string | null;

  verificationStatus: string;

  certificateReference: string | null;

  active: boolean;

  createdAt: string | null;

  updatedAt: string | null;
};

type EmployeeSkill = {
  id: number;
  employeeId: number;
  skillName: string;
  skillCategory: string | null;
  skillLevel: string | null;
  yearsOfExperience: number | null;
  lastUsedYear: number | null;
  certificationReference: string | null;
  verificationStatus: string;
  verificationReference: string | null;
  active: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

type Tab =
  | "overview"
  | "personal"
  | "contact"
  | "employment"
  | "organization"
  | "addresses"
  | "education"
  | "skills"
  | "documents"
  | "emergency"
  | "employment-history"
  | "lifecycle-history";

/* =========================================================
   CONSTANTS
========================================================= */

const LIFECYCLE_PERMISSION =
  "EMPLOYEE_LIFECYCLE_HISTORY_VIEW";

/* =========================================================
   HELPERS
========================================================= */

function displayName(
  employee: Employee
) {
  return (
    employee.preferredName ||
    [
      employee.firstName,
      employee.middleName,
      employee.lastName,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function formatEventType(
  value: string
) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    );
}

function statusClass(
  status: string | null
) {
  switch (status) {
    case "ACTIVE":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";

    case "INACTIVE":
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-300";

    case "TERMINATED":
      return "border-red-500/20 bg-red-500/10 text-red-300";

    default:
      return "border-white/10 bg-white/5 text-white/50";
  }
}

function formatDate(
  value: string | null
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatDateTime(
  value: string | null
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function Employee360Page() {

  const [
    profile,
    setProfile,
  ] = useState<AdminProfile | null>(
    null
  );

  const [
    employee,
    setEmployee,
  ] = useState<Employee | null>(
    null
  );

  const [
    lifecycleHistory,
    setLifecycleHistory,
  ] = useState<
    LifecycleHistory[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    historyLoading,
    setHistoryLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    activeTab,
    setActiveTab,
  ] = useState<Tab>("overview");

  const employeeId =
    useEmployeeId();

  const canViewLifecycle =
    hasAdminPermission(
      profile,
      LIFECYCLE_PERMISSION
    );

  async function loadEmployee(
    showRefresh = false
  ) {

    if (!employeeId) {
      return;
    }

    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {

      const adminProfile =
        await getAdminProfile();

      if (!adminProfile) {
        throw new Error(
          "Unable to load administrator profile."
        );
      }

      setProfile(
        adminProfile
      );

      const credentials =
        localStorage.getItem(
          "vaelis_admin_auth"
        );

      if (!credentials) {
        throw new Error(
          "Administrator authentication is missing."
        );
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/employees/${employeeId}`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Basic ${credentials}`,

              Accept:
                "application/json",
            },

            cache:
              "no-store",
          }
        );

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
          `Unable to load employee (${response.status}).`
        );
      }

      const data =
        await response.json();

      setEmployee(
        data
      );

    } catch (err) {

      console.error(
        "Unable to load employee:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load employee."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);
    }
  }

  async function loadLifecycleHistory() {

    if (
      !employeeId ||
      !canViewLifecycle
    ) {
      return;
    }

    setHistoryLoading(true);

    try {

      const credentials =
        localStorage.getItem(
          "vaelis_admin_auth"
        );

      if (!credentials) {
        throw new Error(
          "Administrator authentication is missing."
        );
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/employees/${employeeId}/lifecycle-history`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Basic ${credentials}`,

              Accept:
                "application/json",
            },

            cache:
              "no-store",
          }
        );

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
          `Unable to load lifecycle history (${response.status}).`
        );
      }

      const data =
        await response.json();

      setLifecycleHistory(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Unable to load lifecycle history:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load lifecycle history."
      );

    } finally {

      setHistoryLoading(false);
    }
  }

  useEffect(() => {

    loadEmployee();

  }, [employeeId]);

  useEffect(() => {

    if (
      activeTab ===
      "lifecycle-history"
    ) {
      loadLifecycleHistory();
    }

  }, [
    activeTab,
    employeeId,
    canViewLifecycle,
  ]);

  const initials =
    useMemo(() => {

      if (!employee) {
        return "E";
      }

      return [
        employee.firstName,
        employee.lastName,
      ]
        .filter(Boolean)
        .map(
          (value) =>
            value!.charAt(0)
        )
        .join("")
        .toUpperCase();

    }, [employee]);

  if (loading) {

    return (
      <main className="min-h-screen bg-[#050505] text-white">

        <div className="flex min-h-screen items-center justify-center">

          <div className="flex items-center gap-3 text-white/50">

            <Loader2
              size={20}
              className="animate-spin"
            />

            Loading employee...

          </div>

        </div>

      </main>
    );
  }

  if (!employee) {

    return (
      <main className="min-h-screen bg-[#050505] text-white">

        <div className="mx-auto max-w-4xl px-6 py-12">

          <button
            type="button"
            onClick={() =>
              window.location.href =
                "/admin/employees"
            }
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white"
          >

            <ArrowLeft
              size={16}
            />

            Back to Employees

          </button>

          <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/10 p-8">

            <p className="text-red-300">
              {error ||
                "Employee not found."}
            </p>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      <div className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10">

        {/* =================================================
            TOP NAV
        ================================================= */}

        <div className="flex items-center justify-between">

          <button
            type="button"
            onClick={() =>
              window.location.href =
                "/admin/employees"
            }
            className="flex items-center gap-2 text-sm text-white/45 transition hover:text-white"
          >

            <ArrowLeft
              size={17}
            />

            Employees

          </button>

          <button
            type="button"
            onClick={() =>
              loadEmployee(true)
            }
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/60 transition hover:bg-white/[0.06] disabled:opacity-50"
          >

            <RefreshCw
              size={15}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mt-6 flex items-start justify-between gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
            >
              <X
                size={16}
              />
            </button>

          </div>
        )}

        {/* =================================================
            EMPLOYEE HEADER
        ================================================= */}

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 lg:p-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-5">

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.05] text-xl font-semibold text-white/60">

                {initials}

              </div>

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">

                    {displayName(
                      employee
                    )}

                  </h1>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${statusClass(
                      employee.employmentStatus
                    )}`}
                  >

                    {
                      employee.employmentStatus ||
                      "UNKNOWN"
                    }

                  </span>

                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/40">

                  <span>
                    {
                      employee.employeeCode
                    }
                  </span>

                  <span>
                    {
                      employee.designation ||
                      employee.jobTitle ||
                      "—"
                    }
                  </span>

                  <span>
                    {
                      employee.department ||
                      "—"
                    }
                  </span>

                  <span>
                    {
                      employee.workLocation ||
                      "—"
                    }
                  </span>

                </div>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

              <HeaderStat
                label="Joined"
                value={formatDate(
                  employee.dateOfJoining
                )}
              />

              <HeaderStat
                label="Grade"
                value={
                  employee.grade ||
                  "—"
                }
              />

              <HeaderStat
                label="Work Mode"
                value={
                  employee.workMode ||
                  "—"
                }
              />

            </div>

          </div>

        </section>

        {/* =================================================
            TABS
        ================================================= */}

        <div className="mt-6 overflow-x-auto border-b border-white/10">

          <div className="flex min-w-max gap-1">

            {getTabs(
              canViewLifecycle
            ).map(
              (tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      tab.id
                    )
                  }
                  className={`rounded-t-xl px-4 py-3 text-sm transition ${
                    activeTab ===
                    tab.id
                      ? "bg-white/[0.06] text-white"
                      : "text-white/40 hover:bg-white/[0.03] hover:text-white/70"
                  }`}
                >
                  {
                    tab.label
                  }
                </button>
              )
            )}

          </div>

        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="mt-6">

          {activeTab ===
            "overview" && (
            <OverviewTab
              employee={employee}
            />
          )}

          {activeTab ===
            "addresses" && (
            <AddressesTab
              employeeId={
                employeeId
              }
              profile={profile}
            />
          )}

          {activeTab ===
            "personal" && (
            <PersonalTab
              employee={employee}
            />
          )}

          {activeTab ===
            "contact" && (
            <ContactTab
              employee={employee}
            />
          )}

          {activeTab ===
            "employment" && (
            <EmploymentTab
              employee={employee}
            />
          )}

          {activeTab ===
            "organization" && (
            <OrganizationTab
              employee={employee}
            />
          )}

          {activeTab ===
            "education" && (
            <EducationTab
              employeeId={
                employeeId
              }
              profile={profile}
            />
          )}

          {activeTab ===
            "skills" && (
            <SkillsTab
              employeeId={
                employeeId
              }
              profile={profile}
            />
          )}

          {activeTab ===
            "documents" && (
            <PlaceholderTab
              icon={
                <FileText
                  size={28}
                />
              }
              title="Documents"
              description="Employee documents will be displayed here."
            />
          )}

          {activeTab ===
            "emergency" && (
            <PlaceholderTab
              icon={
                <Phone
                  size={28}
                />
              }
              title="Emergency Contacts"
              description="Emergency contact records will be displayed here."
            />
          )}

          {activeTab ===
            "employment-history" && (
            <PlaceholderTab
              icon={
                <BriefcaseBusiness
                  size={28}
                />
              }
              title="Employment History"
              description="Employee employment history will be displayed here."
            />
          )}

          {activeTab ===
            "lifecycle-history" && (
            <LifecycleHistoryTab
              history={
                lifecycleHistory
              }
              loading={
                historyLoading
              }
            />
          )}

        </div>

      </div>

    </main>
  );
}

/* =========================================================
   EMPLOYEE ID
========================================================= */

function useEmployeeId() {

  const [
    employeeId,
    setEmployeeId,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {

    const parts =
      window.location.pathname
        .split("/")
        .filter(Boolean);

    const index =
      parts.indexOf(
        "employees"
      );

    if (
      index !== -1 &&
      parts[index + 1]
    ) {
      setEmployeeId(
        parts[index + 1]
      );
    }

  }, []);

  return employeeId;
}

/* =========================================================
   TABS
========================================================= */

function getTabs(
  includeLifecycle: boolean
) {

  const tabs: {
    id: Tab;
    label: string;
  }[] = [

    {
      id: "overview",
      label: "Overview",
    },

    {
      id: "personal",
      label: "Personal",
    },

    {
      id: "contact",
      label: "Contact",
    },

    {
      id: "employment",
      label: "Employment",
    },

    {
      id: "organization",
      label: "Organization",
    },

    {
      id: "addresses",
      label: "Addresses",
    },

    {
      id: "education",
      label: "Education",
    },

    {
      id: "skills",
      label: "Skills",
    },

    {
      id: "documents",
      label: "Documents",
    },

    {
      id: "emergency",
      label: "Emergency",
    },

    {
      id: "employment-history",
      label: "Employment History",
    },

  ];

  if (includeLifecycle) {

    tabs.push({
      id: "lifecycle-history",
      label: "Lifecycle History",
    });

  }

  return tabs;
}

/* =========================================================
   HEADER STAT
========================================================= */

function HeaderStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (
    <div className="min-w-[110px] rounded-2xl border border-white/10 bg-black/20 px-4 py-3">

      <p className="text-[10px] uppercase tracking-wider text-white/25">
        {label}
      </p>

      <p className="mt-1 text-sm text-white/70">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   OVERVIEW
========================================================= */

function OverviewTab({
  employee,
}: {
  employee: Employee;
}) {

  return (
    <div className="grid gap-5 lg:grid-cols-3">

      <InfoCard
        title="Identity"
        icon={
          <UserRound
            size={18}
          />
        }
      >

        <InfoRow
          label="Employee Code"
          value={
            employee.employeeCode
          }
        />

        <InfoRow
          label="Full Name"
          value={
            displayName(employee)
          }
        />

        <InfoRow
          label="Date of Birth"
          value={formatDate(
            employee.dateOfBirth
          )}
        />

        <InfoRow
          label="Gender"
          value={
            employee.gender
          }
        />

        <InfoRow
          label="Nationality"
          value={
            employee.nationality
          }
        />

      </InfoCard>

      <InfoCard
        title="Employment"
        icon={
          <BriefcaseBusiness
            size={18}
          />
        }
      >

        <InfoRow
          label="Department"
          value={
            employee.department
          }
        />

        <InfoRow
          label="Designation"
          value={
            employee.designation
          }
        />

        <InfoRow
          label="Job Title"
          value={
            employee.jobTitle
          }
        />

        <InfoRow
          label="Grade"
          value={
            employee.grade
          }
        />

        <InfoRow
          label="Employment Type"
          value={
            employee.employmentType
          }
        />

      </InfoCard>

      <InfoCard
        title="Work"
        icon={
          <Building2
            size={18}
          />
        }
      >

        <InfoRow
          label="Branch"
          value={
            employee.branch
          }
        />

        <InfoRow
          label="Location"
          value={
            employee.workLocation
          }
        />

        <InfoRow
          label="Work Mode"
          value={
            employee.workMode
          }
        />

        <InfoRow
          label="Date of Joining"
          value={formatDate(
            employee.dateOfJoining
          )}
        />

        <InfoRow
          label="Profile Status"
          value={
            employee.profileStatus
          }
        />

      </InfoCard>

      <div className="lg:col-span-2">

        <InfoCard
          title="Contact"
          icon={
            <Phone
              size={18}
            />
          }
        >

          <div className="grid gap-4 md:grid-cols-2">

            <InfoRow
              label="Official Email"
              value={
                employee.officialEmail
              }
            />

            <InfoRow
              label="Personal Email"
              value={
                employee.personalEmail
              }
            />

            <InfoRow
              label="Primary Mobile"
              value={
                employee.primaryMobile
              }
            />

            <InfoRow
              label="Alternate Mobile"
              value={
                employee.alternateMobile
              }
            />

          </div>

        </InfoCard>

      </div>

      <div>

        <InfoCard
          title="Account"
          icon={
            <ShieldCheck
              size={18}
            />
          }
        >

          <InfoRow
            label="Profile Status"
            value={
              employee.profileStatus
            }
          />

          <InfoRow
            label="Employment Status"
            value={
              employee.employmentStatus
            }
          />

        </InfoCard>

      </div>

    </div>
  );
}

/* =========================================================
   PERSONAL
========================================================= */

function PersonalTab({
  employee,
}: {
  employee: Employee;
}) {

  return (
    <div className="grid gap-5 md:grid-cols-2">

      <InfoCard
        title="Personal Identity"
        icon={
          <UserRound
            size={18}
          />
        }
      >

        <InfoRow
          label="First Name"
          value={
            employee.firstName
          }
        />

        <InfoRow
          label="Middle Name"
          value={
            employee.middleName
          }
        />

        <InfoRow
          label="Last Name"
          value={
            employee.lastName
          }
        />

        <InfoRow
          label="Preferred Name"
          value={
            employee.preferredName
          }
        />

      </InfoCard>

      <InfoCard
        title="Personal Details"
        icon={
          <CalendarDays
            size={18}
          />
        }
      >

        <InfoRow
          label="Date of Birth"
          value={formatDate(
            employee.dateOfBirth
          )}
        />

        <InfoRow
          label="Gender"
          value={
            employee.gender
          }
        />

        <InfoRow
          label="Nationality"
          value={
            employee.nationality
          }
        />

        <InfoRow
          label="Marital Status"
          value={
            employee.maritalStatus
          }
        />

      </InfoCard>

    </div>
  );
}

/* =========================================================
   CONTACT
========================================================= */

function ContactTab({
  employee,
}: {
  employee: Employee;
}) {

  return (
    <div className="grid gap-5 md:grid-cols-2">

      <InfoCard
        title="Email"
        icon={
          <Mail
            size={18}
          />
        }
      >

        <InfoRow
          label="Official Email"
          value={
            employee.officialEmail
          }
        />

        <InfoRow
          label="Personal Email"
          value={
            employee.personalEmail
          }
        />

      </InfoCard>

      <InfoCard
        title="Phone"
        icon={
          <Phone
            size={18}
          />
        }
      >

        <InfoRow
          label="Primary Mobile"
          value={
            employee.primaryMobile
          }
        />

        <InfoRow
          label="Alternate Mobile"
          value={
            employee.alternateMobile
          }
        />

      </InfoCard>

    </div>
  );
}

/* =========================================================
   EMPLOYMENT
========================================================= */

function EmploymentTab({
  employee,
}: {
  employee: Employee;
}) {

  return (
    <div className="grid gap-5 md:grid-cols-2">

      <InfoCard
        title="Employment"
        icon={
          <BriefcaseBusiness
            size={18}
          />
        }
      >

        <InfoRow
          label="Employment Type"
          value={
            employee.employmentType
          }
        />

        <InfoRow
          label="Employment Status"
          value={
            employee.employmentStatus
          }
        />

        <InfoRow
          label="Date of Joining"
          value={formatDate(
            employee.dateOfJoining
          )}
        />

      </InfoCard>

      <InfoCard
        title="Position"
        icon={
          <Building2
            size={18}
          />
        }
      >

        <InfoRow
          label="Department"
          value={
            employee.department
          }
        />

        <InfoRow
          label="Designation"
          value={
            employee.designation
          }
        />

        <InfoRow
          label="Job Title"
          value={
            employee.jobTitle
          }
        />

        <InfoRow
          label="Grade"
          value={
            employee.grade
          }
        />

      </InfoCard>

    </div>
  );
}

/* =========================================================
   ORGANIZATION
========================================================= */

function OrganizationTab({
  employee,
}: {
  employee: Employee;
}) {

  return (
    <div className="grid gap-5 md:grid-cols-2">

      <InfoCard
        title="Organization"
        icon={
          <Building2
            size={18}
          />
        }
      >

        <InfoRow
          label="Department"
          value={
            employee.department
          }
        />

        <InfoRow
          label="Designation"
          value={
            employee.designation
          }
        />

        <InfoRow
          label="Job Title"
          value={
            employee.jobTitle
          }
        />

        <InfoRow
          label="Grade"
          value={
            employee.grade
          }
        />

      </InfoCard>

      <InfoCard
        title="Work Location"
        icon={
          <MapPin
            size={18}
          />
        }
      >

        <InfoRow
          label="Branch"
          value={
            employee.branch
          }
        />

        <InfoRow
          label="Work Location"
          value={
            employee.workLocation
          }
        />

        <InfoRow
          label="Work Mode"
          value={
            employee.workMode
          }
        />

      </InfoCard>

      <div className="md:col-span-2">

        <InfoCard
          title="Reporting Structure"
          icon={
            <Users
              size={18}
            />
          }
        >

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">

            <p className="text-sm text-white/60">
              Current reporting manager
              information is not included
              in the current
              EmployeeRecordResponse
              contract.
            </p>

            <p className="mt-2 text-xs leading-5 text-white/30">
              Manager changes can
              currently be inspected
              through Lifecycle History.
            </p>

          </div>

        </InfoCard>

      </div>

    </div>
  );
}

/* =========================================================
   ADDRESSES
========================================================= */

function AddressesTab({
  employeeId,
  profile,
}: {
  employeeId: string | null;
  profile: AdminProfile | null;
}) {

  const [
    addresses,
    setAddresses,
  ] = useState<
    EmployeeAddress[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    showAddForm,
    setShowAddForm,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    form,
    setForm,
  ] = useState({
    addressType: "CURRENT",

    addressLine1: "",
    addressLine2: "",

    landmark: "",

    city: "",
    state: "",
    district: "",

    country: "India",

    postalCode: "",

    contactMobile: "",

    active: true,
  });

  const canView =
    hasAdminPermission(
      profile,
      "EMPLOYEE_ADDRESS_VIEW"
    );

  const canCreate =
    hasAdminPermission(
      profile,
      "EMPLOYEE_ADDRESS_CREATE"
    );

  const canUpdate =
    hasAdminPermission(
      profile,
      "EMPLOYEE_ADDRESS_UPDATE"
    );

  const canDelete =
    hasAdminPermission(
      profile,
      "EMPLOYEE_ADDRESS_DELETE"
    );

  async function loadAddresses() {

    if (
      !employeeId ||
      !canView
    ) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {

      const credentials =
        localStorage.getItem(
          "vaelis_admin_auth"
        );

      if (!credentials) {
        throw new Error(
          "Administrator authentication is missing."
        );
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/employees/${employeeId}/addresses`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Basic ${credentials}`,

              Accept:
                "application/json",
            },

            cache:
              "no-store",
          }
        );

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
          `Unable to load addresses (${response.status}).`
        );
      }

      const data =
        await response.json();

      setAddresses(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Unable to load employee addresses:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load employee addresses."
      );

    } finally {

      setLoading(false);
    }
  }

  async function createAddress(
    event: React.FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    if (
      !employeeId ||
      !canCreate
    ) {
      return;
    }

    setSaving(true);
    setError("");

    try {

      const credentials =
        localStorage.getItem(
          "vaelis_admin_auth"
        );

      if (!credentials) {
        throw new Error(
          "Administrator authentication is missing."
        );
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/employees/${employeeId}/addresses`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Basic ${credentials}`,

              Accept:
                "application/json",

              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                form
              ),
          }
        );

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
          `Unable to create address (${response.status}).`
        );
      }

      setForm({
        addressType: "CURRENT",

        addressLine1: "",
        addressLine2: "",

        landmark: "",

        city: "",
        state: "",
        district: "",

        country: "India",

        postalCode: "",

        contactMobile: "",

        active: true,
      });

      setShowAddForm(false);

      await loadAddresses();

    } catch (err) {

      console.error(
        "Unable to create employee address:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create employee address."
      );

    } finally {

      setSaving(false);
    }
  }

  function updateForm(
    field: keyof typeof form,
    value: string | boolean
  ) {

    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    );
  }

  useEffect(() => {

    loadAddresses();

  }, [
    employeeId,
    canView,
  ]);

  if (!canView) {

    return (
      <PlaceholderTab
        icon={
          <MapPin
            size={28}
          />
        }
        title="Addresses"
        description="You do not have permission to view employee addresses."
      />
    );
  }

  if (loading) {

    return (
      <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] py-20 text-white/40">

        <Loader2
          size={20}
          className="mr-3 animate-spin"
        />

        Loading addresses...

      </div>
    );
  }

  return (
    <div className="space-y-5">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h2 className="text-lg font-medium">
            Addresses
          </h2>

          <p className="mt-1 text-sm text-white/35">
            Employee residential and
            other address records.
          </p>

        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={() =>
              loadAddresses()
            }
            className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm text-white/60 transition hover:border-white/20 hover:text-white"
          >

            <RefreshCw
              size={15}
            />

            Refresh

          </button>

          {canCreate && (
            <button
              type="button"
              onClick={() =>
                setShowAddForm(
                  (current) =>
                    !current
                )
              }
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              {showAddForm
                ? "Cancel"
                : "+ Add Address"}
            </button>
          )}

        </div>

      </div>

      {error && (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-300">

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="text-red-300/60 hover:text-red-300"
          >
            <X
              size={16}
            />
          </button>

        </div>
      )}

      {showAddForm &&
        canCreate && (

          <form
            onSubmit={
              createAddress
            }
            className="rounded-3xl border border-white/10 bg-white/[0.02] p-6"
          >

            <div className="mb-6">

              <h3 className="text-base font-medium">
                Add Employee Address
              </h3>

              <p className="mt-1 text-sm text-white/35">
                Enter the address
                details and save
                the record.
              </p>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <AddressInput
                label="Address Type"
                value={
                  form.addressType
                }
                onChange={(
                  value
                ) =>
                  updateForm(
                    "addressType",
                    value
                  )
                }
                required
                placeholder="CURRENT"
              />

              <AddressInput
                label="Contact Mobile"
                value={
                  form.contactMobile
                }
                onChange={(
                  value
                ) =>
                  updateForm(
                    "contactMobile",
                    value
                  )
                }
                placeholder="9876543210"
              />

              <div className="md:col-span-2">

                <AddressInput
                  label="Address Line 1"
                  value={
                    form.addressLine1
                  }
                  onChange={(
                    value
                  ) =>
                    updateForm(
                      "addressLine1",
                      value
                    )
                  }
                  required
                  placeholder="House / Flat / Street"
                />

              </div>

              <div className="md:col-span-2">

                <AddressInput
                  label="Address Line 2"
                  value={
                    form.addressLine2
                  }
                  onChange={(
                    value
                  ) =>
                    updateForm(
                      "addressLine2",
                      value
                    )
                  }
                  placeholder="Area / Locality"
                />

              </div>

              <AddressInput
                label="Landmark"
                value={
                  form.landmark
                }
                onChange={(
                  value
                ) =>
                  updateForm(
                    "landmark",
                    value
                  )
                }
                placeholder="Nearby landmark"
              />

              <AddressInput
                label="City"
                value={
                  form.city
                }
                onChange={(
                  value
                ) =>
                  updateForm(
                    "city",
                    value
                  )
                }
                required
                placeholder="Delhi"
              />

              <AddressInput
                label="District"
                value={
                  form.district
                }
                onChange={(
                  value
                ) =>
                  updateForm(
                    "district",
                    value
                  )
                }
                placeholder="District"
              />

              <AddressInput
                label="State"
                value={
                  form.state
                }
                onChange={(
                  value
                ) =>
                  updateForm(
                    "state",
                    value
                  )
                }
                required
                placeholder="Delhi"
              />

              <AddressInput
                label="Country"
                value={
                  form.country
                }
                onChange={(
                  value
                ) =>
                  updateForm(
                    "country",
                    value
                  )
                }
                required
                placeholder="India"
              />

              <AddressInput
                label="Postal Code"
                value={
                  form.postalCode
                }
                onChange={(
                  value
                ) =>
                  updateForm(
                    "postalCode",
                    value
                  )
                }
                required
                placeholder="110001"
              />

              <label className="flex items-center gap-3 self-end pb-1 text-sm text-white/60">

                <input
                  type="checkbox"
                  checked={
                    form.active
                  }
                  onChange={(
                    event
                  ) =>
                    updateForm(
                      "active",
                      event.target
                        .checked
                    )
                  }
                  className="h-4 w-4 rounded border-white/20 bg-black"
                />

                Active address

              </label>

            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-white/5 pt-5">

              <button
                type="button"
                onClick={() =>
                  setShowAddForm(false)
                }
                disabled={saving}
                className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/55 transition hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {saving && (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                )}

                {saving
                  ? "Saving..."
                  : "Save Address"}

              </button>

            </div>

          </form>
        )}

      {addresses.length === 0 ? (

        <PlaceholderTab
          icon={
            <MapPin
              size={28}
            />
          }
          title="No Addresses"
          description="No address records have been added for this employee."
        />

      ) : (

        <div className="grid gap-5 md:grid-cols-2">

          {addresses.map(
            (address) => (

              <div
                key={address.id}
                className="rounded-3xl border border-white/10 bg-white/[0.02] p-6"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <div className="flex items-center gap-2">

                      <MapPin
                        size={17}
                        className="text-white/40"
                      />

                      <h3 className="font-medium">
                        {
                          address.addressType
                        }
                      </h3>

                    </div>

                    <span
                      className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wider ${
                        address.active
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                          : "border-white/10 bg-white/5 text-white/30"
                      }`}
                    >

                      {address.active
                        ? "Active"
                        : "Inactive"}

                    </span>

                  </div>

                  <span className="text-xs text-white/20">
                    #{address.id}
                  </span>

                </div>

                <div className="mt-5 space-y-2 text-sm text-white/60">

                  <p>
                    {
                      address.addressLine1
                    }
                  </p>

                  {address.addressLine2 && (
                    <p>
                      {
                        address.addressLine2
                      }
                    </p>
                  )}

                  {address.landmark && (
                    <p className="text-white/40">
                      {
                        address.landmark
                      }
                    </p>
                  )}

                  <p>
                    {[
                      address.city,
                      address.district,
                      address.state,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  <p>
                    {
                      address.country
                    }{" "}
                    —{" "}
                    {
                      address.postalCode
                    }
                  </p>

                  {address.contactMobile && (
                    <p className="pt-2 text-white/40">
                      Contact:{" "}
                      {
                        address.contactMobile
                      }
                    </p>
                  )}

                </div>

                {(canUpdate ||
                  canDelete) && (

                  <div className="mt-6 flex justify-end gap-2 border-t border-white/5 pt-4">

                    {canUpdate && (
                      <button
                        type="button"
                        className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/50 hover:text-white"
                      >
                        Edit
                      </button>
                    )}

                    {canDelete && (
                      <button
                        type="button"
                        className="rounded-full border border-red-400/10 px-4 py-2 text-xs text-red-300/70 hover:text-red-300"
                      >
                        Delete
                      </button>
                    )}

                  </div>
                )}

              </div>

            )
          )}

        </div>
      )}

    </div>
  );
}

/* =========================================================
   ADDRESS INPUT
========================================================= */

function AddressInput({
  label,
  value,
  onChange,
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  required?: boolean;
  placeholder?: string;
}) {

  return (
    <div>

      <label className="mb-2 block text-xs uppercase tracking-wider text-white/35">

        {label}

        {required && (
          <span className="ml-1 text-red-300">
            *
          </span>
        )}

      </label>

      <input
        type="text"
        value={value}
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/30"
      />

    </div>
  );
}

/* =========================================================
   EDUCATION
========================================================= */

function EducationTab({
  employeeId,
  profile,
}: {
  employeeId: string | null;
  profile: AdminProfile | null;
}) {

  const [
    education,
    setEducation,
  ] = useState<
    EmployeeEducation[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    editingId,
    setEditingId,
  ] = useState<
    number | null
  >(null);

  const [
    deletingId,
    setDeletingId,
  ] = useState<
    number | null
  >(null);

  const emptyForm = {
    educationLevel: "",
    qualification: "",
    specialization: "",
    institution: "",
    universityOrBoard: "",
    startYear: "",
    completionYear: "",
    gradingType: "",
    gradeOrPercentage: "",
    registrationNumber: "",
    verificationStatus: "PENDING",
    certificateReference: "",
    active: true,
  };

  const [
    form,
    setForm,
  ] = useState(
    emptyForm
  );

  const canView =
    hasAdminPermission(
      profile,
      "EMPLOYEE_EDUCATION_VIEW"
    );

  const canCreate =
    hasAdminPermission(
      profile,
      "EMPLOYEE_EDUCATION_CREATE"
    );

  const canUpdate =
    hasAdminPermission(
      profile,
      "EMPLOYEE_EDUCATION_UPDATE"
    );

  const canDelete =
    hasAdminPermission(
      profile,
      "EMPLOYEE_EDUCATION_DELETE"
    );

  async function loadEducation() {

    if (
      !employeeId ||
      !canView
    ) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {

      const authHeader =
  getAdminAuthHeader();

if (!authHeader) {
  throw new Error(
    "Administrator authentication is missing."
  );
}

      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/employees/${employeeId}/education`,
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

        const message =
          await response.text();

        throw new Error(
          message ||
          `Unable to load education (${response.status}).`
        );
      }

      const data =
        await response.json();

      setEducation(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Unable to load employee education:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load employee education."
      );

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {

    loadEducation();

  }, [
    employeeId,
    canView,
  ]);

  function updateForm(
    field: keyof typeof form,
    value: string | boolean
  ) {

    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    );
  }

  function resetForm() {

    setForm({
      ...emptyForm,
    });

    setEditingId(null);
    setShowForm(false);
  }

  function startAdd() {

    setError("");

    setForm({
      ...emptyForm,
    });

    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(
    record: EmployeeEducation
  ) {

    setError("");

    setForm({

      educationLevel:
        record.educationLevel ||
        "",

      qualification:
        record.qualification ||
        "",

      specialization:
        record.specialization ||
        "",

      institution:
        record.institution ||
        "",

      universityOrBoard:
        record.universityOrBoard ||
        "",

      startYear:
        record.startYear != null
          ? String(
              record.startYear
            )
          : "",

      completionYear:
        record.completionYear != null
          ? String(
              record.completionYear
            )
          : "",

      gradingType:
        record.gradingType ||
        "",

      gradeOrPercentage:
        record.gradeOrPercentage ||
        "",

      registrationNumber:
        record.registrationNumber ||
        "",

      verificationStatus:
        record.verificationStatus ||
        "PENDING",

      certificateReference:
        record.certificateReference ||
        "",

      active:
        record.active,
    });

    setEditingId(
      record.id
    );

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function submitEducation(
    event: React.FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    if (!employeeId) {
      return;
    }

    if (
      editingId !== null &&
      !canUpdate
    ) {
      return;
    }

    if (
      editingId === null &&
      !canCreate
    ) {
      return;
    }

    setSaving(true);
    setError("");

    try {

      const authHeader =
  getAdminAuthHeader();

if (!authHeader) {
  throw new Error(
    "Administrator authentication is missing."
  );
}

      const payload = {
        educationLevel:
          form.educationLevel.trim(),

        qualification:
          form.qualification.trim(),

        specialization:
          form.specialization.trim() ||
          null,

        institution:
          form.institution.trim(),

        universityOrBoard:
          form.universityOrBoard.trim() ||
          null,

        startYear:
          form.startYear
            ? Number(
                form.startYear
              )
            : null,

        completionYear:
          form.completionYear
            ? Number(
                form.completionYear
              )
            : null,

        gradingType:
          form.gradingType.trim() ||
          null,

        gradeOrPercentage:
          form.gradeOrPercentage.trim() ||
          null,

        registrationNumber:
          form.registrationNumber.trim() ||
          null,

        verificationStatus:
          form.verificationStatus,

        certificateReference:
          form.certificateReference.trim() ||
          null,

        active:
          form.active,
      };

      const url =
        editingId !== null
          ? `${API_BASE_URL}/api/admin/employees/${employeeId}/education/${editingId}`
          : `${API_BASE_URL}/api/admin/employees/${employeeId}/education`;

      const response =
        await fetch(
          url,
          {
            method:
              editingId !== null
                ? "PUT"
                : "POST",

            headers: {
              Authorization:
                authHeader,

              Accept:
                "application/json",

              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload
              ),
          }
        );

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
          `Unable to ${
            editingId !== null
              ? "update"
              : "create"
          } education (${response.status}).`
        );
      }

      resetForm();

      await loadEducation();

    } catch (err) {

      console.error(
        "Unable to save employee education:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save employee education."
      );

    } finally {

      setSaving(false);
    }
  }

  async function deleteEducation(
    educationId: number
  ) {

    if (
      !employeeId ||
      !canDelete
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this education record?"
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(
      educationId
    );

    setError("");

    try {

      const authHeader =
  getAdminAuthHeader();

if (!authHeader) {
  throw new Error(
    "Administrator authentication is missing."
  );
}

      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/employees/${employeeId}/education/${educationId}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                authHeader,

              Accept:
                "application/json",
            },
          }
        );

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
          `Unable to delete education (${response.status}).`
        );
      }

      if (
        editingId === educationId
      ) {
        resetForm();
      }

      await loadEducation();

    } catch (err) {

      console.error(
        "Unable to delete employee education:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete employee education."
      );

    } finally {

      setDeletingId(
        null
      );
    }
  }

  if (!canView) {

    return (
      <PlaceholderTab
        icon={
          <GraduationCap
            size={28}
          />
        }
        title="Education"
        description="You do not have permission to view employee education."
      />
    );
  }

  if (loading) {

    return (
      <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] py-20 text-white/40">

        <Loader2
          size={20}
          className="mr-3 animate-spin"
        />

        Loading education...

      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* =================================================
          EDUCATION HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h2 className="text-lg font-medium">
            Education
          </h2>

          <p className="mt-1 text-sm text-white/35">
            Employee academic and
            professional education
            records.
          </p>

        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={() =>
              loadEducation()
            }
            className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm text-white/60 transition hover:border-white/20 hover:text-white"
          >

            <RefreshCw
              size={15}
            />

            Refresh

          </button>

          {canCreate && (
            <button
              type="button"
              onClick={() =>
                showForm
                  ? resetForm()
                  : startAdd()
              }
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >

              {showForm
                ? "Cancel"
                : "+ Add Education"}

            </button>
          )}

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-300">

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="text-red-300/60 hover:text-red-300"
          >
            <X
              size={16}
            />
          </button>

        </div>
      )}

      {/* =================================================
          EDUCATION FORM
      ================================================= */}

      {showForm && (

        <form
          onSubmit={
            submitEducation
          }
          className="rounded-3xl border border-white/10 bg-white/[0.02] p-6"
        >

          <div className="mb-6">

            <h3 className="text-base font-medium">

              {editingId !== null
                ? "Edit Education"
                : "Add Employee Education"}

            </h3>

            <p className="mt-1 text-sm text-white/35">

              {editingId !== null
                ? "Update the education record and save your changes."
                : "Enter the employee education details."}

            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <EducationInput
              label="Education Level"
              value={
                form.educationLevel
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "educationLevel",
                  value
                )
              }
              required
              placeholder="Graduation"
            />

            <EducationInput
              label="Qualification"
              value={
                form.qualification
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "qualification",
                  value
                )
              }
              required
              placeholder="B.Tech"
            />

            <EducationInput
              label="Specialization"
              value={
                form.specialization
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "specialization",
                  value
                )
              }
              placeholder="Computer Science"
            />

            <EducationInput
              label="Institution"
              value={
                form.institution
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "institution",
                  value
                )
              }
              required
              placeholder="ABC Institute"
            />

            <EducationInput
              label="University / Board"
              value={
                form.universityOrBoard
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "universityOrBoard",
                  value
                )
              }
              placeholder="University / Board"
            />

            <EducationInput
              label="Registration Number"
              value={
                form.registrationNumber
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "registrationNumber",
                  value
                )
              }
              placeholder="Registration number"
            />

            <EducationInput
              label="Start Year"
              value={
                form.startYear
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "startYear",
                  value
                )
              }
              type="number"
              placeholder="2018"
            />

            <EducationInput
              label="Completion Year"
              value={
                form.completionYear
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "completionYear",
                  value
                )
              }
              type="number"
              placeholder="2022"
            />

            <EducationInput
              label="Grading Type"
              value={
                form.gradingType
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "gradingType",
                  value
                )
              }
              placeholder="Percentage / CGPA / Grade"
            />

            <EducationInput
              label="Grade / Percentage"
              value={
                form.gradeOrPercentage
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "gradeOrPercentage",
                  value
                )
              }
              placeholder="82"
            />

            <EducationInput
              label="Verification Status"
              value={
                form.verificationStatus
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "verificationStatus",
                  value
                )
              }
              placeholder="PENDING"
            />

            <EducationInput
              label="Certificate Reference"
              value={
                form.certificateReference
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "certificateReference",
                  value
                )
              }
              placeholder="Document reference"
            />

            <label className="flex items-center gap-3 self-end pb-1 text-sm text-white/60">

              <input
                type="checkbox"
                checked={
                  form.active
                }
                onChange={(
                  event
                ) =>
                  updateForm(
                    "active",
                    event.target
                      .checked
                  )
                }
                className="h-4 w-4 rounded border-white/20 bg-black"
              />

              Active education
              record

            </label>

          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-white/5 pt-5">

            <button
              type="button"
              onClick={() =>
                resetForm()
              }
              disabled={saving}
              className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/55 transition hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {saving && (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              )}

              {saving
                ? "Saving..."
                : editingId !== null
                  ? "Save Changes"
                  : "Save Education"}

            </button>

          </div>

        </form>
      )}

      {/* =================================================
          EDUCATION LIST
      ================================================= */}

      {education.length === 0 ? (

        <PlaceholderTab
          icon={
            <GraduationCap
              size={28}
            />
          }
          title="No Education Records"
          description="No education records have been added for this employee."
        />

      ) : (

        <div className="grid gap-5 md:grid-cols-2">

          {education.map(
            (record) => (

              <div
                key={record.id}
                className="rounded-3xl border border-white/10 bg-white/[0.02] p-6"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <div className="flex items-center gap-2">

                      <GraduationCap
                        size={18}
                        className="text-white/40"
                      />

                      <h3 className="font-medium">
                        {
                          record.qualification
                        }
                      </h3>

                    </div>

                    <p className="mt-1 text-sm text-white/40">
                      {
                        record.educationLevel
                      }
                    </p>

                  </div>

                  <span className="text-xs text-white/20">
                    #{record.id}
                  </span>

                </div>

                <div className="mt-5 space-y-2 text-sm">

                  <EducationDetail
                    label="Specialization"
                    value={
                      record.specialization
                    }
                  />

                  <EducationDetail
                    label="Institution"
                    value={
                      record.institution
                    }
                  />

                  <EducationDetail
                    label="University / Board"
                    value={
                      record.universityOrBoard
                    }
                  />

                  <EducationDetail
                    label="Period"
                    value={[
                      record.startYear,
                      record.completionYear,
                    ]
                      .filter(
                        (
                          value
                        ) =>
                          value !=
                          null
                      )
                      .join(" — ")}
                  />

                  <EducationDetail
                    label="Result"
                    value={[
                      record.gradingType,
                      record.gradeOrPercentage,
                    ]
                      .filter(Boolean)
                      .join(" — ")}
                  />

                  <EducationDetail
                    label="Verification"
                    value={
                      record.verificationStatus
                    }
                  />

                  <EducationDetail
                    label="Registration No."
                    value={
                      record.registrationNumber
                    }
                  />

                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wider ${
                      record.active
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                        : "border-white/10 bg-white/5 text-white/30"
                    }`}
                  >

                    {record.active
                      ? "Active"
                      : "Inactive"}

                  </span>

                  {(canUpdate ||
                    canDelete) && (

                    <div className="flex items-center gap-2">

                      {canUpdate && (
                        <button
                          type="button"
                          onClick={() =>
                            startEdit(
                              record
                            )
                          }
                          disabled={
                            deletingId !==
                            null
                          }
                          className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/50 transition hover:text-white disabled:opacity-50"
                        >
                          Edit
                        </button>
                      )}

                      {canDelete && (
                        <button
                          type="button"
                          onClick={() =>
                            deleteEducation(
                              record.id
                            )
                          }
                          disabled={
                            deletingId ===
                            record.id
                          }
                          className="flex items-center gap-2 rounded-full border border-red-400/10 px-4 py-2 text-xs text-red-300/70 transition hover:text-red-300 disabled:opacity-50"
                        >

                          {deletingId ===
                            record.id && (
                            <Loader2
                              size={12}
                              className="animate-spin"
                            />
                          )}

                          {deletingId ===
                          record.id
                            ? "Deleting..."
                            : "Delete"}

                        </button>
                      )}

                    </div>
                  )}

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}

/* =========================================================
   EDUCATION INPUT
========================================================= */

function EducationInput({
  label,
  value,
  onChange,
  required = false,
  placeholder,
  type = "text",
}: {
  label: string;

  value: string;

  onChange: (
    value: string
  ) => void;

  required?: boolean;

  placeholder?: string;

  type?: "text" | "number";
}) {

  return (
    <div>

      <label className="mb-2 block text-xs uppercase tracking-wider text-white/35">

        {label}

        {required && (
          <span className="ml-1 text-red-300">
            *
          </span>
        )}

      </label>

      <input
        type={type}
        value={value}
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/30"
      />

    </div>
  );
}

/* =========================================================
   EDUCATION DETAIL
========================================================= */

function EducationDetail({
  label,
  value,
}: {
  label: string;

  value:
    | string
    | number
    | null
    | undefined;
}) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.04] pb-2 last:border-0">

      <span className="text-xs text-white/30">
        {label}
      </span>

      <span className="text-right text-sm text-white/65">
        {value}
      </span>

    </div>
  );
}

/* =========================================================
   SKILLS
========================================================= */

function SkillsTab({
  employeeId,
  profile,
}: {
  employeeId: string | null;
  profile: AdminProfile | null;
}) {

  const [skills, setSkills] =
    useState<EmployeeSkill[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [error, setError] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const emptyForm = {
    skillName: "",
    skillCategory: "",
    skillLevel: "",
    yearsOfExperience: "",
    lastUsedYear: "",
    certificationReference: "",
    verificationStatus: "PENDING",
    verificationReference: "",
    active: true,
  };

  const [form, setForm] =
    useState(emptyForm);

  const canView =
    hasAdminPermission(
      profile,
      "EMPLOYEE_SKILL_VIEW"
    );

  const canCreate =
    hasAdminPermission(
      profile,
      "EMPLOYEE_SKILL_CREATE"
    );

  const canUpdate =
    hasAdminPermission(
      profile,
      "EMPLOYEE_SKILL_UPDATE"
    );

  const canDelete =
    hasAdminPermission(
      profile,
      "EMPLOYEE_SKILL_DELETE"
    );

  async function loadSkills() {

    if (!employeeId || !canView) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {

      const authHeader =
        getAdminAuthHeader();

      if (!authHeader) {
        throw new Error(
          "Administrator authentication is missing."
        );
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/employees/${employeeId}/skills`,
          {
            method: "GET",
            headers: {
              Authorization: authHeader,
              Accept: "application/json",
            },
            cache: "no-store",
          }
        );

      if (!response.ok) {
        const message =
          await response.text();

        throw new Error(
          message ||
          `Unable to load skills (${response.status}).`
        );
      }

      const data =
        await response.json();

      setSkills(
        Array.isArray(data) ? data : []
      );

    } catch (err) {

      console.error(
        "Unable to load employee skills:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load employee skills."
      );

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSkills();
  }, [employeeId, canView]);

  function updateForm(
    field: keyof typeof form,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(false);
  }

  function startAdd() {
    setError("");
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(record: EmployeeSkill) {
    setError("");

    setForm({
      skillName: record.skillName || "",
      skillCategory: record.skillCategory || "",
      skillLevel: record.skillLevel || "",
      yearsOfExperience:
        record.yearsOfExperience != null
          ? String(record.yearsOfExperience)
          : "",
      lastUsedYear:
        record.lastUsedYear != null
          ? String(record.lastUsedYear)
          : "",
      certificationReference:
        record.certificationReference || "",
      verificationStatus:
        record.verificationStatus || "PENDING",
      verificationReference:
        record.verificationReference || "",
      active: record.active,
    });

    setEditingId(record.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function submitSkill(
    event: React.FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    if (!employeeId) {
      return;
    }

    if (editingId !== null && !canUpdate) {
      return;
    }

    if (editingId === null && !canCreate) {
      return;
    }

    setSaving(true);
    setError("");

    try {

      const authHeader =
        getAdminAuthHeader();

      if (!authHeader) {
        throw new Error(
          "Administrator authentication is missing."
        );
      }

      const yearsOfExperience =
        form.yearsOfExperience.trim()
          ? Number(form.yearsOfExperience)
          : null;

      const lastUsedYear =
        form.lastUsedYear.trim()
          ? Number(form.lastUsedYear)
          : null;

      if (
        yearsOfExperience !== null &&
        (!Number.isFinite(yearsOfExperience) ||
          yearsOfExperience < 0 ||
          yearsOfExperience > 99.99)
      ) {
        throw new Error(
          "Years of experience must be between 0 and 99.99."
        );
      }

      if (
        lastUsedYear !== null &&
        (!Number.isInteger(lastUsedYear) ||
          lastUsedYear < 1900 ||
          lastUsedYear > new Date().getFullYear())
      ) {
        throw new Error(
          "Last used year is invalid."
        );
      }

      const payload = {
        skillName: form.skillName.trim(),
        skillCategory:
          form.skillCategory.trim() || null,
        skillLevel:
          form.skillLevel.trim() || null,
        yearsOfExperience,
        lastUsedYear,
        certificationReference:
          form.certificationReference.trim() || null,
        verificationStatus:
          form.verificationStatus,
        verificationReference:
          form.verificationReference.trim() || null,
        active: form.active,
      };

      if (!payload.skillName) {
        throw new Error(
          "Skill name is required."
        );
      }

      const url =
        editingId !== null
          ? `${API_BASE_URL}/api/admin/employees/${employeeId}/skills/${editingId}`
          : `${API_BASE_URL}/api/admin/employees/${employeeId}/skills`;

      const response =
        await fetch(url, {
          method:
            editingId !== null ? "PUT" : "POST",
          headers: {
            Authorization: authHeader,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

      if (!response.ok) {
        const message =
          await response.text();

        throw new Error(
          message ||
          `Unable to ${
            editingId !== null ? "update" : "create"
          } skill (${response.status}).`
        );
      }

      resetForm();
      await loadSkills();

    } catch (err) {

      console.error(
        "Unable to save employee skill:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save employee skill."
      );

    } finally {
      setSaving(false);
    }
  }

  async function deleteSkill(skillId: number) {

    if (!employeeId || !canDelete) {
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this skill?"
      )
    ) {
      return;
    }

    setDeletingId(skillId);
    setError("");

    try {

      const authHeader =
        getAdminAuthHeader();

      if (!authHeader) {
        throw new Error(
          "Administrator authentication is missing."
        );
      }

      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/employees/${employeeId}/skills/${skillId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: authHeader,
              Accept: "application/json",
            },
          }
        );

      if (!response.ok) {
        const message =
          await response.text();

        throw new Error(
          message ||
          `Unable to delete skill (${response.status}).`
        );
      }

      if (editingId === skillId) {
        resetForm();
      }

      await loadSkills();

    } catch (err) {

      console.error(
        "Unable to delete employee skill:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete employee skill."
      );

    } finally {
      setDeletingId(null);
    }
  }

  if (!canView) {
    return (
      <PlaceholderTab
        icon={<ShieldCheck size={28} />}
        title="Skills"
        description="You do not have permission to view employee skills."
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] py-20 text-white/40">
        <Loader2
          size={20}
          className="mr-3 animate-spin"
        />
        Loading skills...
      </div>
    );
  }

  return (
    <div className="space-y-5">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-medium">
            Skills
          </h2>
          <p className="mt-1 text-sm text-white/35">
            Employee technical, functional, and professional skill records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadSkills()}
            className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm text-white/60 transition hover:border-white/20 hover:text-white"
          >
            <RefreshCw size={15} />
            Refresh
          </button>

          {canCreate && (
            <button
              type="button"
              onClick={() =>
                showForm ? resetForm() : startAdd()
              }
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              {showForm ? "Cancel" : "+ Add Skill"}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-300">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-300/60 hover:text-red-300"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={submitSkill}
          className="rounded-3xl border border-white/10 bg-white/[0.02] p-6"
        >
          <div className="mb-6">
            <h3 className="text-base font-medium">
              {editingId !== null ? "Edit Skill" : "Add Employee Skill"}
            </h3>
            <p className="mt-1 text-sm text-white/35">
              {editingId !== null
                ? "Update the skill record and save your changes."
                : "Enter the employee skill details."}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <SkillInput
              label="Skill Name"
              value={form.skillName}
              onChange={(value) =>
                updateForm("skillName", value)
              }
              required
              placeholder="Java"
            />

            <SkillInput
              label="Skill Category"
              value={form.skillCategory}
              onChange={(value) =>
                updateForm("skillCategory", value)
              }
              placeholder="Programming"
            />

            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-white/35">
                Skill Level
              </label>
              <select
                value={form.skillLevel}
                onChange={(event) =>
                  updateForm("skillLevel", event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
              >
                <option value="">Select level</option>
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
                <option value="EXPERT">EXPERT</option>
              </select>
            </div>

            <SkillInput
              label="Years of Experience"
              value={form.yearsOfExperience}
              onChange={(value) =>
                updateForm("yearsOfExperience", value)
              }
              type="number"
              step="0.01"
              min="0"
              max="99.99"
              placeholder="5.5"
            />

            <SkillInput
              label="Last Used Year"
              value={form.lastUsedYear}
              onChange={(value) =>
                updateForm("lastUsedYear", value)
              }
              type="number"
              min="1900"
              max={String(new Date().getFullYear())}
              placeholder={String(new Date().getFullYear())}
            />

            <SkillInput
              label="Certification Reference"
              value={form.certificationReference}
              onChange={(value) =>
                updateForm("certificationReference", value)
              }
              placeholder="Certification name / reference"
            />

            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-white/35">
                Verification Status
              </label>
              <select
                value={form.verificationStatus}
                onChange={(event) =>
                  updateForm(
                    "verificationStatus",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
              >
                <option value="PENDING">PENDING</option>
                <option value="VERIFIED">VERIFIED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            <SkillInput
              label="Verification Reference"
              value={form.verificationReference}
              onChange={(value) =>
                updateForm("verificationReference", value)
              }
              placeholder="Verification document / reference"
            />

            <label className="flex items-center gap-3 self-end pb-1 text-sm text-white/60">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) =>
                  updateForm("active", event.target.checked)
                }
                className="h-4 w-4 rounded border-white/20 bg-black"
              />
              Active skill record
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-white/5 pt-5">
            <button
              type="button"
              onClick={() => resetForm()}
              disabled={saving}
              className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/55 transition hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving && (
                <Loader2 size={15} className="animate-spin" />
              )}
              {saving
                ? "Saving..."
                : editingId !== null
                  ? "Save Changes"
                  : "Save Skill"}
            </button>
          </div>
        </form>
      )}

      {skills.length === 0 ? (
        <PlaceholderTab
          icon={<ShieldCheck size={28} />}
          title="No Skills"
          description="No skill records have been added for this employee."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {skills.map((record) => (
            <div
              key={record.id}
              className="rounded-3xl border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck
                      size={18}
                      className="text-white/40"
                    />
                    <h3 className="font-medium">
                      {record.skillName}
                    </h3>
                  </div>
                  {record.skillCategory && (
                    <p className="mt-1 text-sm text-white/40">
                      {record.skillCategory}
                    </p>
                  )}
                </div>
                <span className="text-xs text-white/20">
                  #{record.id}
                </span>
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <SkillDetail
                  label="Level"
                  value={record.skillLevel}
                />
                <SkillDetail
                  label="Experience"
                  value={
                    record.yearsOfExperience != null
                      ? `${record.yearsOfExperience} years`
                      : null
                  }
                />
                <SkillDetail
                  label="Last Used"
                  value={
                    record.lastUsedYear != null
                      ? String(record.lastUsedYear)
                      : null
                  }
                />
                <SkillDetail
                  label="Certification"
                  value={record.certificationReference}
                />
                <SkillDetail
                  label="Verification"
                  value={record.verificationStatus}
                />
                <SkillDetail
                  label="Verification Reference"
                  value={record.verificationReference}
                />
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                <span
                  className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wider ${
                    record.active
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                      : "border-white/10 bg-white/5 text-white/30"
                  }`}
                >
                  {record.active ? "Active" : "Inactive"}
                </span>

                {(canUpdate || canDelete) && (
                  <div className="flex items-center gap-2">
                    {canUpdate && (
                      <button
                        type="button"
                        onClick={() => startEdit(record)}
                        disabled={deletingId !== null}
                        className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/50 transition hover:text-white disabled:opacity-50"
                      >
                        Edit
                      </button>
                    )}

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => deleteSkill(record.id)}
                        disabled={deletingId === record.id}
                        className="flex items-center gap-2 rounded-full border border-red-400/10 px-4 py-2 text-xs text-red-300/70 transition hover:text-red-300 disabled:opacity-50"
                      >
                        {deletingId === record.id && (
                          <Loader2
                            size={12}
                            className="animate-spin"
                          />
                        )}
                        {deletingId === record.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SKILL INPUT
========================================================= */

function SkillInput({
  label,
  value,
  onChange,
  required = false,
  placeholder,
  type = "text",
  min,
  max,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: "text" | "number";
  min?: string;
  max?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-wider text-white/35">
        {label}
        {required && (
          <span className="ml-1 text-red-300">*</span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/30"
      />
    </div>
  );
}

/* =========================================================
   SKILL DETAIL
========================================================= */

function SkillDetail({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.04] pb-2 last:border-0">
      <span className="text-xs text-white/30">
        {label}
      </span>
      <span className="text-right text-sm text-white/65">
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   LIFECYCLE HISTORY
========================================================= */

function LifecycleHistoryTab({
  history,
  loading,
}: {
  history: LifecycleHistory[];

  loading: boolean;
}) {

  if (loading) {

    return (
      <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] py-20 text-white/40">

        <Loader2
          size={20}
          className="mr-3 animate-spin"
        />

        Loading lifecycle history...

      </div>
    );
  }

  if (history.length === 0) {

    return (
      <PlaceholderTab
        icon={
          <Clock3
            size={28}
          />
        }
        title="No Lifecycle History"
        description="No lifecycle events have been recorded for this employee."
      />
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02]">

      <div className="border-b border-white/10 px-6 py-5">

        <h2 className="font-medium">
          Lifecycle History
        </h2>

        <p className="mt-1 text-sm text-white/35">
          Chronological record of
          employee lifecycle and
          organization changes.
        </p>

      </div>

      <div className="divide-y divide-white/[0.06]">

        {history.map(
          (event) => (

            <div
              key={event.id}
              className="px-6 py-6"
            >

              <div className="flex gap-5">

                <div className="relative flex w-8 shrink-0 justify-center">

                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">

                    <Clock3
                      size={14}
                      className="text-white/50"
                    />

                  </div>

                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                    <div>

                      <h3 className="font-medium">

                        {formatEventType(
                          event.eventType
                        )}

                      </h3>

                      <p className="mt-1 text-xs text-white/35">

                        Effective{" "}

                        {formatDate(
                          event.effectiveDate
                        )}

                      </p>

                    </div>

                    <div className="text-left sm:text-right">

                      <p className="text-xs text-white/40">
                        Changed by
                      </p>

                      <p className="mt-1 text-sm text-white/65">

                        {
                          event.changedBy ||
                          "—"
                        }

                      </p>

                      {event.changedByRole && (

                        <p className="mt-1 text-xs text-white/30">

                          {
                            event.changedByRole
                          }

                        </p>
                      )}

                    </div>

                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">

                    <ChangeRow
                      label="Status"
                      previous={
                        event.previousStatus
                      }
                      next={
                        event.newStatus
                      }
                    />

                    <ChangeRow
                      label="Department"
                      previous={
                        event.previousDepartment
                      }
                      next={
                        event.newDepartment
                      }
                    />

                    <ChangeRow
                      label="Designation"
                      previous={
                        event.previousDesignation
                      }
                      next={
                        event.newDesignation
                      }
                    />

                    <ChangeRow
                      label="Reporting Manager"
                      previous={
                        event.previousReportingManagerId ===
                        null
                          ? null
                          : String(
                              event.previousReportingManagerId
                            )
                      }
                      next={
                        event.newReportingManagerId ===
                        null
                          ? null
                          : String(
                              event.newReportingManagerId
                            )
                      }
                    />

                    <ChangeRow
                      label="Functional Manager"
                      previous={
                        event.previousFunctionalManagerId ===
                        null
                          ? null
                          : String(
                              event.previousFunctionalManagerId
                            )
                      }
                      next={
                        event.newFunctionalManagerId ===
                        null
                          ? null
                          : String(
                              event.newFunctionalManagerId
                            )
                      }
                    />

                  </div>

                  {event.reason && (

                    <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">

                      <p className="text-[10px] uppercase tracking-wider text-white/25">
                        Reason
                      </p>

                      <p className="mt-1 text-sm text-white/55">
                        {
                          event.reason
                        }
                      </p>

                    </div>
                  )}

                  {event.remarks && (

                    <p className="mt-3 text-xs text-white/30">

                      {
                        event.remarks
                      }

                    </p>
                  )}

                  <p className="mt-4 text-[11px] text-white/20">

                    Recorded{" "}

                    {formatDateTime(
                      event.createdAt
                    )}

                  </p>

                </div>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}

/* =========================================================
   CHANGE ROW
========================================================= */

function ChangeRow({
  label,
  previous,
  next,
}: {
  label: string;

  previous: string | null;

  next: string | null;
}) {

  if (
    previous === null &&
    next === null
  ) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">

      <p className="text-[10px] uppercase tracking-wider text-white/25">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2 text-sm">

        <span className="text-white/35">
          {previous ?? "—"}
        </span>

        <ChevronRight
          size={14}
          className="text-white/20"
        />

        <span className="text-white/75">
          {next ?? "—"}
        </span>

      </div>

    </div>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  title,
  icon,
  children,
}: {
  title: string;

  icon: React.ReactNode;

  children: React.ReactNode;
}) {

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">

      <div className="mb-5 flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/50">

          {icon}

        </div>

        <h2 className="font-medium">
          {title}
        </h2>

      </div>

      <div className="space-y-4">
        {children}
      </div>

    </section>
  );
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  label,
  value,
}: {
  label: string;

  value:
    | string
    | null
    | undefined;
}) {

  return (
    <div className="flex items-start justify-between gap-5 border-b border-white/[0.05] pb-3 last:border-0 last:pb-0">

      <span className="text-xs text-white/30">
        {label}
      </span>

      <span className="text-right text-sm text-white/70">
        {value || "—"}
      </span>

    </div>
  );
}

/* =========================================================
   PLACEHOLDER
========================================================= */

function PlaceholderTab({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;

  title: string;

  description: string;
}) {

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] px-6 py-20 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/25">

        {icon}

      </div>

      <h2 className="mt-5 text-lg font-medium">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
        {description}
      </p>

    </div>
  );
}