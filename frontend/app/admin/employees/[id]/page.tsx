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
type EmployeeEmploymentHistory = {
  id: number;
  employeeId: number;

  companyName: string;
  companyLocation: string | null;
  industry: string | null;

  jobTitle: string;
  designation: string | null;
  department: string | null;
  employmentType: string | null;

  startDate: string | null;
  endDate: string | null;

  lastDrawnDesignation: string | null;
  lastDrawnSalary: number | null;

  reasonForLeaving: string | null;

  reportingManager: string | null;
  hrContactName: string | null;
  hrContactEmail: string | null;
  hrContactMobile: string | null;

  verificationStatus: string;
  verificationReference: string | null;

  active: boolean;

  createdAt: string | null;
  updatedAt: string | null;
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
type EmployeeEmergencyContact = {
  id: number;
  employeeId: number;

  contactName: string;
  relationship: string;

  primaryMobile: string;
  alternateMobile: string | null;
  email: string | null;

  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;

  primary: boolean;
  active: boolean;

  createdAt: string | null;
  updatedAt: string | null;
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

type EmployeeDocument = {
  id: number;
  employeeId: number;

  documentType: string;
  documentCategory: string | null;
  documentName: string;

  documentNumber: string | null;
  documentReference: string | null;

  fileReference: string | null;
  originalFileName: string | null;
  contentType: string | null;
  fileSizeBytes: number | null;

  issueDate: string | null;
  expiryDate: string | null;

  verificationStatus: string;
  verifiedBy: string | null;
  verifiedAt: string | null;
  verificationNotes: string | null;

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
  <DocumentsTab
    employeeId={
      employeeId
    }
    profile={profile}
  />
)}

          {activeTab ===
  "emergency" && (
  <EmergencyContactsTab
    employeeId={employeeId}
    profile={profile}
  />
)}

          {activeTab ===
  "employment-history" && (
  <EmploymentHistoryTab
    employeeId={employeeId}
    profile={profile}
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
   DOCUMENTS
========================================================= */

function DocumentsTab({
  employeeId,
  profile,
}: {
  employeeId: string | null;
  profile: AdminProfile | null;
}) {

  const [
    documents,
    setDocuments,
  ] = useState<EmployeeDocument[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    deletingId,
    setDeletingId,
  ] = useState<number | null>(null);

  const [
    error,
    setError,
  ] = useState("");

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    editingId,
    setEditingId,
  ] = useState<number | null>(null);

  const emptyForm = {
    documentType: "",
    documentCategory: "",
    documentName: "",
    documentNumber: "",
    documentReference: "",
    fileReference: "",
    originalFileName: "",
    contentType: "",
    fileSizeBytes: "",
    issueDate: "",
    expiryDate: "",
    verificationStatus: "PENDING",
    verificationNotes: "",
    active: true,
  };

  const [
    form,
    setForm,
  ] = useState(emptyForm);

  // =======================================================
  // PERMISSIONS
  // =======================================================

  const canView =
    hasAdminPermission(
      profile,
      "EMPLOYEE_DOCUMENT_VIEW"
    );

  const canCreate =
    hasAdminPermission(
      profile,
      "EMPLOYEE_DOCUMENT_CREATE"
    );

  const canUpdate =
    hasAdminPermission(
      profile,
      "EMPLOYEE_DOCUMENT_UPDATE"
    );

  const canDelete =
    hasAdminPermission(
      profile,
      "EMPLOYEE_DOCUMENT_DELETE"
    );

  // =======================================================
  // LOAD DOCUMENTS
  // =======================================================

  async function loadDocuments() {

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
          `${API_BASE_URL}/api/admin/employees/${employeeId}/documents`,
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
          `Unable to load documents (${response.status}).`
        );
      }

      const data =
        await response.json();

      setDocuments(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Unable to load employee documents:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load employee documents."
      );

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {

    loadDocuments();

  }, [
    employeeId,
    canView,
  ]);

  // =======================================================
  // FORM
  // =======================================================

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
    document: EmployeeDocument
  ) {

    setError("");

    setForm({

      documentType:
        document.documentType ||
        "",

      documentCategory:
        document.documentCategory ||
        "",

      documentName:
        document.documentName ||
        "",

      documentNumber:
        document.documentNumber ||
        "",

      documentReference:
        document.documentReference ||
        "",

      fileReference:
        document.fileReference ||
        "",

      originalFileName:
        document.originalFileName ||
        "",

      contentType:
        document.contentType ||
        "",

      fileSizeBytes:
        document.fileSizeBytes != null
          ? String(
              document.fileSizeBytes
            )
          : "",

      issueDate:
        document.issueDate ||
        "",

      expiryDate:
        document.expiryDate ||
        "",

      verificationStatus:
        document.verificationStatus ||
        "PENDING",

      verificationNotes:
        document.verificationNotes ||
        "",

      active:
        document.active,
    });

    setEditingId(
      document.id
    );

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =======================================================
  // SAVE DOCUMENT
  // =======================================================

  async function submitDocument(
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

      // ===================================================
      // VALIDATE DATES
      // ===================================================

      if (
        form.issueDate &&
        form.expiryDate &&
        form.expiryDate <
          form.issueDate
      ) {
        throw new Error(
          "Expiry date cannot be before issue date."
        );
      }

      // ===================================================
      // FILE SIZE
      // ===================================================

      const fileSizeBytes =
        form.fileSizeBytes.trim()
          ? Number(
              form.fileSizeBytes
            )
          : null;

      if (
        fileSizeBytes !== null &&
        (
          !Number.isFinite(
            fileSizeBytes
          ) ||
          fileSizeBytes < 0
        )
      ) {
        throw new Error(
          "File size must be a valid non-negative number."
        );
      }

      // ===================================================
      // PAYLOAD
      // ===================================================

      const payload = {

        documentType:
          form.documentType.trim(),

        documentCategory:
          form.documentCategory.trim() ||
          null,

        documentName:
          form.documentName.trim(),

        documentNumber:
          form.documentNumber.trim() ||
          null,

        documentReference:
          form.documentReference.trim() ||
          null,

        fileReference:
          form.fileReference.trim() ||
          null,

        originalFileName:
          form.originalFileName.trim() ||
          null,

        contentType:
          form.contentType.trim() ||
          null,

        fileSizeBytes,

        issueDate:
          form.issueDate ||
          null,

        expiryDate:
          form.expiryDate ||
          null,

        verificationStatus:
          form.verificationStatus,

        verificationNotes:
          form.verificationNotes.trim() ||
          null,

        active:
          form.active,
      };

      // ===================================================
      // URL
      // ===================================================

      const url =
        editingId !== null
          ? `${API_BASE_URL}/api/admin/employees/${employeeId}/documents/${editingId}`
          : `${API_BASE_URL}/api/admin/employees/${employeeId}/documents`;

      // ===================================================
      // REQUEST
      // ===================================================

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
          } document (${response.status}).`
        );
      }

      resetForm();

      await loadDocuments();

    } catch (err) {

      console.error(
        "Unable to save employee document:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save employee document."
      );

    } finally {

      setSaving(false);
    }
  }

  // =======================================================
  // DELETE DOCUMENT
  // =======================================================

  async function deleteDocument(
    documentId: number
  ) {

    if (
      !employeeId ||
      !canDelete
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this document?"
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(
      documentId
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
          `${API_BASE_URL}/api/admin/employees/${employeeId}/documents/${documentId}`,
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
          `Unable to delete document (${response.status}).`
        );
      }

      if (
        editingId ===
        documentId
      ) {
        resetForm();
      }

      await loadDocuments();

    } catch (err) {

      console.error(
        "Unable to delete employee document:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete employee document."
      );

    } finally {

      setDeletingId(
        null
      );
    }
  }

  // =======================================================
  // PERMISSION
  // =======================================================

  if (!canView) {

    return (
      <PlaceholderTab
        icon={
          <FileText
            size={28}
          />
        }
        title="Documents"
        description="You do not have permission to view employee documents."
      />
    );
  }

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {

    return (
      <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] py-20 text-white/40">

        <Loader2
          size={20}
          className="mr-3 animate-spin"
        />

        Loading documents...

      </div>
    );
  }

  // =======================================================
  // UI
  // =======================================================

  return (
    <div className="space-y-5">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h2 className="text-lg font-medium">
            Documents
          </h2>

          <p className="mt-1 text-sm text-white/35">
            Employee identity, compliance,
            qualification and other
            document records.
          </p>

        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={() =>
              loadDocuments()
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
                : "+ Add Document"}

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
          FORM
      ================================================= */}

      {showForm && (

        <form
          onSubmit={
            submitDocument
          }
          className="rounded-3xl border border-white/10 bg-white/[0.02] p-6"
        >

          <div className="mb-6">

            <h3 className="text-base font-medium">

              {editingId !== null
                ? "Edit Document"
                : "Add Employee Document"}

            </h3>

            <p className="mt-1 text-sm text-white/35">

              {editingId !== null
                ? "Update the document metadata and save your changes."
                : "Enter the employee document details."}

            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <DocumentInput
              label="Document Type"
              value={
                form.documentType
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "documentType",
                  value
                )
              }
              required
              placeholder="AADHAAR / PAN / PASSPORT"
            />

            <DocumentInput
              label="Document Category"
              value={
                form.documentCategory
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "documentCategory",
                  value
                )
              }
              placeholder="Identity / Compliance"
            />

            <DocumentInput
              label="Document Name"
              value={
                form.documentName
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "documentName",
                  value
                )
              }
              required
              placeholder="Aadhaar Card"
            />

            <DocumentInput
              label="Document Number"
              value={
                form.documentNumber
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "documentNumber",
                  value
                )
              }
              placeholder="Document number"
            />

            <DocumentInput
              label="Document Reference"
              value={
                form.documentReference
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "documentReference",
                  value
                )
              }
              placeholder="Internal reference"
            />

            <DocumentInput
              label="File Reference"
              value={
                form.fileReference
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "fileReference",
                  value
                )
              }
              placeholder="Storage reference / URL"
            />

            <DocumentInput
              label="Original File Name"
              value={
                form.originalFileName
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "originalFileName",
                  value
                )
              }
              placeholder="aadhaar.pdf"
            />

            <DocumentInput
              label="Content Type"
              value={
                form.contentType
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "contentType",
                  value
                )
              }
              placeholder="application/pdf"
            />

            <DocumentInput
              label="File Size (Bytes)"
              value={
                form.fileSizeBytes
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "fileSizeBytes",
                  value
                )
              }
              type="number"
              placeholder="102400"
            />

            <DocumentInput
              label="Issue Date"
              value={
                form.issueDate
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "issueDate",
                  value
                )
              }
              type="date"
            />

            <DocumentInput
              label="Expiry Date"
              value={
                form.expiryDate
              }
              onChange={(
                value
              ) =>
                updateForm(
                  "expiryDate",
                  value
                )
              }
              type="date"
            />

            <DocumentInput
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
              placeholder="PENDING / VERIFIED"
            />

            <div className="md:col-span-2">

              <label className="mb-2 block text-xs uppercase tracking-wider text-white/35">

                Verification Notes

              </label>

              <textarea
                value={
                  form.verificationNotes
                }
                onChange={(
                  event
                ) =>
                  updateForm(
                    "verificationNotes",
                    event.target.value
                  )
                }
                rows={4}
                placeholder="Verification remarks"
                className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/30"
              />

            </div>

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

              Active document

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
                  : "Save Document"}

            </button>

          </div>

        </form>
      )}

      {/* =================================================
          LIST
      ================================================= */}

      {documents.length === 0 ? (

        <PlaceholderTab
          icon={
            <FileText
              size={28}
            />
          }
          title="No Documents"
          description="No document records have been added for this employee."
        />

      ) : (

        <div className="grid gap-5 md:grid-cols-2">

          {documents.map(
            (document) => (

              <div
                key={document.id}
                className="rounded-3xl border border-white/10 bg-white/[0.02] p-6"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <div className="flex items-center gap-2">

                      <FileText
                        size={18}
                        className="text-white/40"
                      />

                      <h3 className="font-medium">
                        {
                          document.documentName
                        }
                      </h3>

                    </div>

                    <p className="mt-1 text-sm text-white/40">
                      {
                        document.documentType
                      }

                      {document.documentCategory &&
                        ` · ${document.documentCategory}`}
                    </p>

                  </div>

                  <span className="text-xs text-white/20">
                    #{document.id}
                  </span>

                </div>

                <div className="mt-5 space-y-2 text-sm">

                  <DocumentDetail
                    label="Document Number"
                    value={
                      document.documentNumber
                    }
                  />

                  <DocumentDetail
                    label="Reference"
                    value={
                      document.documentReference
                    }
                  />

                  <DocumentDetail
                    label="File"
                    value={
                      document.originalFileName
                    }
                  />

                  <DocumentDetail
                    label="Content Type"
                    value={
                      document.contentType
                    }
                  />

                  <DocumentDetail
                    label="Issue Date"
                    value={formatDate(
                      document.issueDate
                    )}
                  />

                  <DocumentDetail
                    label="Expiry Date"
                    value={formatDate(
                      document.expiryDate
                    )}
                  />

                  <DocumentDetail
                    label="Verified By"
                    value={
                      document.verifiedBy
                    }
                  />

                  <DocumentDetail
                    label="Verified At"
                    value={formatDateTime(
                      document.verifiedAt
                    )}
                  />

                  <DocumentDetail
                    label="Verification Notes"
                    value={
                      document.verificationNotes
                    }
                  />

                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">

                  <div className="flex items-center gap-2">

                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wider ${
                        document.verificationStatus ===
                        "VERIFIED"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                          : "border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
                      }`}
                    >

                      {
                        document.verificationStatus
                      }

                    </span>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wider ${
                        document.active
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                          : "border-white/10 bg-white/5 text-white/30"
                      }`}
                    >

                      {document.active
                        ? "Active"
                        : "Inactive"}

                    </span>

                  </div>

                  {(canUpdate ||
                    canDelete) && (

                    <div className="flex items-center gap-2">

                      {canUpdate && (
                        <button
                          type="button"
                          onClick={() =>
                            startEdit(
                              document
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
                            deleteDocument(
                              document.id
                            )
                          }
                          disabled={
                            deletingId ===
                            document.id
                          }
                          className="flex items-center gap-2 rounded-full border border-red-400/10 px-4 py-2 text-xs text-red-300/70 transition hover:text-red-300 disabled:opacity-50"
                        >

                          {deletingId ===
                            document.id && (
                            <Loader2
                              size={12}
                              className="animate-spin"
                            />
                          )}

                          {deletingId ===
                          document.id
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
   DOCUMENT INPUT
========================================================= */

function DocumentInput({
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
  type?:
    | "text"
    | "number"
    | "date";
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
   DOCUMENT DETAIL
========================================================= */

function DocumentDetail({
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
    value === "" ||
    value === "—"
  ) {
    return null;
  }

  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.04] pb-2 last:border-0">

      <span className="text-xs text-white/30">
        {label}
      </span>

      <span className="max-w-[65%] text-right text-sm text-white/65 break-words">
        {value}
      </span>

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
function EmergencyContactsTab({
  employeeId,
  profile,
}: {
  employeeId: string | null;
  profile: AdminProfile | null;
}) {
  const [contacts, setContacts] =
    useState<EmployeeEmergencyContact[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [form, setForm] = useState({
    contactName: "",
    relationship: "",
    primaryMobile: "",
    alternateMobile: "",
    email: "",

    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",

    primary: false,
    active: true,
  });

  // =========================================================
  // PERMISSIONS
  // =========================================================

  const canView =
    hasAdminPermission(
      profile,
      "EMPLOYEE_EMERGENCY_CONTACT_VIEW"
    );

  const canCreate =
    hasAdminPermission(
      profile,
      "EMPLOYEE_EMERGENCY_CONTACT_CREATE"
    );

  const canUpdate =
    hasAdminPermission(
      profile,
      "EMPLOYEE_EMERGENCY_CONTACT_UPDATE"
    );

  const canDelete =
    hasAdminPermission(
      profile,
      "EMPLOYEE_EMERGENCY_CONTACT_DELETE"
    );

  // =========================================================
  // RESET FORM
  // =========================================================

  function resetForm() {
    setForm({
      contactName: "",
      relationship: "",
      primaryMobile: "",
      alternateMobile: "",
      email: "",

      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "India",
      postalCode: "",

      primary: false,
      active: true,
    });

    setEditingId(null);
  }

  // =========================================================
  // LOAD CONTACTS
  // =========================================================

  async function loadContacts() {
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
          `${API_BASE_URL}/api/admin/employees/${employeeId}/emergency-contacts`,
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
          `Unable to load emergency contacts (${response.status}).`
        );
      }

      const data =
        await response.json();

      setContacts(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Unable to load emergency contacts:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load emergency contacts."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // EFFECT
  // =========================================================

  useEffect(() => {
    loadContacts();
  }, [
    employeeId,
    canView,
  ]);

  // =========================================================
  // FORM FIELD UPDATE
  // =========================================================

  function updateForm(
    field:
      | "contactName"
      | "relationship"
      | "primaryMobile"
      | "alternateMobile"
      | "email"
      | "addressLine1"
      | "addressLine2"
      | "city"
      | "state"
      | "country"
      | "postalCode"
      | "primary"
      | "active",
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // =========================================================
  // START ADD
  // =========================================================

  function startAdd() {
    resetForm();
    setError("");
    setShowForm(true);
  }

  // =========================================================
  // START EDIT
  // =========================================================

  function startEdit(
    contact: EmployeeEmergencyContact
  ) {
    setError("");

    setEditingId(
      contact.id
    );

    setForm({
      contactName:
        contact.contactName || "",

      relationship:
        contact.relationship || "",

      primaryMobile:
        contact.primaryMobile || "",

      alternateMobile:
        contact.alternateMobile || "",

      email:
        contact.email || "",

      addressLine1:
        contact.addressLine1 || "",

      addressLine2:
        contact.addressLine2 || "",

      city:
        contact.city || "",

      state:
        contact.state || "",

      country:
        contact.country || "India",

      postalCode:
        contact.postalCode || "",

      primary:
        contact.primary,

      active:
        contact.active,
    });

    setShowForm(true);
  }

  // =========================================================
  // CANCEL FORM
  // =========================================================

  function cancelForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    resetForm();
    setError("");
  }

  // =========================================================
  // SAVE
  // =========================================================

  async function submitContact(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!employeeId) {
      return;
    }

    if (
      editingId === null &&
      !canCreate
    ) {
      return;
    }

    if (
      editingId !== null &&
      !canUpdate
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

      const url =
        editingId === null
          ? `${API_BASE_URL}/api/admin/employees/${employeeId}/emergency-contacts`
          : `${API_BASE_URL}/api/admin/employees/${employeeId}/emergency-contacts/${editingId}`;

      const method =
        editingId === null
          ? "POST"
          : "PUT";

      const response =
        await fetch(
          url,
          {
            method,

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
                form
              ),
          }
        );

      if (!response.ok) {
        const message =
          await response.text();

        throw new Error(
          message ||
          `Unable to ${
            editingId === null
              ? "create"
              : "update"
          } emergency contact (${response.status}).`
        );
      }

      setShowForm(false);

      resetForm();

      await loadContacts();
    } catch (err) {
      console.error(
        "Unable to save employee emergency contact:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save emergency contact."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // DELETE
  // =========================================================

  async function deleteContact(
    contact: EmployeeEmergencyContact
  ) {
    if (
      !employeeId ||
      !canDelete
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete emergency contact "${contact.contactName}"?`
      );

    if (!confirmed) {
      return;
    }

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
          `${API_BASE_URL}/api/admin/employees/${employeeId}/emergency-contacts/${contact.id}`,
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
          `Unable to delete emergency contact (${response.status}).`
        );
      }

      await loadContacts();
    } catch (err) {
      console.error(
        "Unable to delete employee emergency contact:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete emergency contact."
      );
    }
  }

  // =========================================================
  // PERMISSION
  // =========================================================

  if (!canView) {
    return (
      <PlaceholderTab
        icon={
          <Phone size={28} />
        }
        title="Emergency Contacts"
        description="You do not have permission to view employee emergency contacts."
      />
    );
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] py-20 text-white/40">
        <Loader2
          size={20}
          className="mr-3 animate-spin"
        />
        Loading emergency contacts...
      </div>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-5">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h2 className="text-lg font-medium">
            Emergency Contacts
          </h2>

          <p className="mt-1 text-sm text-white/35">
            Manage employee emergency and
            family contact records.
          </p>

        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={() =>
              loadContacts()
            }
            className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm text-white/60 transition hover:border-white/20 hover:text-white"
          >
            <RefreshCw size={15} />
            Refresh
          </button>

          {canCreate && (
            <button
              type="button"
              onClick={() =>
                showForm
                  ? cancelForm()
                  : startAdd()
              }
              disabled={saving}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-50"
            >
              {showForm
                ? "Cancel"
                : "+ Add Contact"}
            </button>
          )}

        </div>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

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
            <X size={16} />
          </button>

        </div>
      )}

      {/* =====================================================
          FORM
      ===================================================== */}

      {showForm && (
        <form
          onSubmit={
            submitContact
          }
          className="rounded-3xl border border-white/10 bg-white/[0.02] p-6"
        >

          <div className="mb-6">

            <h3 className="text-base font-medium">
              {editingId === null
                ? "Add Emergency Contact"
                : "Edit Emergency Contact"}
            </h3>

            <p className="mt-1 text-sm text-white/35">
              Enter the emergency contact details.
            </p>

          </div>

          {/* =================================================
              CONTACT
          ================================================= */}

          <div className="grid gap-5 md:grid-cols-2">

            <EmergencyInput
              label="Contact Name"
              value={
                form.contactName
              }
              onChange={(value) =>
                updateForm(
                  "contactName",
                  value
                )
              }
              required
              placeholder="Rahul Sharma"
            />

            <EmergencyInput
              label="Relationship"
              value={
                form.relationship
              }
              onChange={(value) =>
                updateForm(
                  "relationship",
                  value
                )
              }
              required
              placeholder="Father / Mother / Spouse"
            />

            <EmergencyInput
              label="Primary Mobile"
              value={
                form.primaryMobile
              }
              onChange={(value) =>
                updateForm(
                  "primaryMobile",
                  value
                )
              }
              required
              placeholder="9876543210"
            />

            <EmergencyInput
              label="Alternate Mobile"
              value={
                form.alternateMobile
              }
              onChange={(value) =>
                updateForm(
                  "alternateMobile",
                  value
                )
              }
              placeholder="Optional"
            />

            <EmergencyInput
              label="Email"
              type="email"
              value={
                form.email
              }
              onChange={(value) =>
                updateForm(
                  "email",
                  value
                )
              }
              placeholder="contact@example.com"
            />

          </div>

          {/* =================================================
              ADDRESS
          ================================================= */}

          <div className="mt-8">

            <h4 className="mb-4 text-sm font-medium text-white/70">
              Address
            </h4>

            <div className="grid gap-5 md:grid-cols-2">

              <div className="md:col-span-2">

                <EmergencyInput
                  label="Address Line 1"
                  value={
                    form.addressLine1
                  }
                  onChange={(value) =>
                    updateForm(
                      "addressLine1",
                      value
                    )
                  }
                  placeholder="House / Flat / Street"
                />

              </div>

              <div className="md:col-span-2">

                <EmergencyInput
                  label="Address Line 2"
                  value={
                    form.addressLine2
                  }
                  onChange={(value) =>
                    updateForm(
                      "addressLine2",
                      value
                    )
                  }
                  placeholder="Area / Locality"
                />

              </div>

              <EmergencyInput
                label="City"
                value={
                  form.city
                }
                onChange={(value) =>
                  updateForm(
                    "city",
                    value
                  )
                }
                placeholder="Delhi"
              />

              <EmergencyInput
                label="State"
                value={
                  form.state
                }
                onChange={(value) =>
                  updateForm(
                    "state",
                    value
                  )
                }
                placeholder="Delhi"
              />

              <EmergencyInput
                label="Country"
                value={
                  form.country
                }
                onChange={(value) =>
                  updateForm(
                    "country",
                    value
                  )
                }
                placeholder="India"
              />

              <EmergencyInput
                label="Postal Code"
                value={
                  form.postalCode
                }
                onChange={(value) =>
                  updateForm(
                    "postalCode",
                    value
                  )
                }
                placeholder="110001"
              />

            </div>

          </div>

          {/* =================================================
              STATUS
          ================================================= */}

          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center">

            <label className="flex items-center gap-3 text-sm text-white/60">

              <input
                type="checkbox"
                checked={
                  form.primary
                }
                onChange={(event) =>
                  updateForm(
                    "primary",
                    event.target.checked
                  )
                }
                className="h-4 w-4 rounded border-white/20 bg-black"
              />

              Primary emergency contact

            </label>

            <label className="flex items-center gap-3 text-sm text-white/60">

              <input
                type="checkbox"
                checked={
                  form.active
                }
                onChange={(event) =>
                  updateForm(
                    "active",
                    event.target.checked
                  )
                }
                className="h-4 w-4 rounded border-white/20 bg-black"
              />

              Active contact

            </label>

          </div>

          <p className="mt-3 text-xs text-white/25">
            Setting this contact as primary will automatically
            remove the primary status from the employee's
            existing primary emergency contact.
          </p>

          {/* =================================================
              FORM ACTIONS
          ================================================= */}

          <div className="mt-6 flex justify-end gap-3 border-t border-white/5 pt-5">

            <button
              type="button"
              onClick={
                cancelForm
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
                : editingId === null
                  ? "Save Contact"
                  : "Update Contact"}

            </button>

          </div>

        </form>
      )}

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {contacts.length === 0 ? (
        <PlaceholderTab
          icon={
            <Phone size={28} />
          }
          title="No Emergency Contacts"
          description="No emergency contact records have been added for this employee."
        />
      ) : (

        /* ===================================================
           CONTACT CARDS
        =================================================== */

        <div className="grid gap-5 md:grid-cols-2">

          {contacts.map(
            (contact) => (

              <div
                key={
                  contact.id
                }
                className="rounded-3xl border border-white/10 bg-white/[0.02] p-6"
              >

                {/* =========================================
                    CARD HEADER
                ========================================= */}

                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">

                      <div className="flex items-center gap-2">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/40">

                          <Phone
                            size={16}
                          />

                        </div>

                        <h3 className="font-medium">
                          {
                            contact.contactName
                          }
                        </h3>

                      </div>

                    </div>

                    <p className="mt-2 text-sm text-white/40">
                      {
                        contact.relationship
                      }
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      {contact.primary && (
                        <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-emerald-300">
                          Primary
                        </span>
                      )}

                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wider ${
                          contact.active
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                            : "border-white/10 bg-white/5 text-white/30"
                        }`}
                      >
                        {contact.active
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </div>

                  </div>

                  <span className="shrink-0 text-xs text-white/20">
                    #{contact.id}
                  </span>

                </div>

                {/* =========================================
                    CONTACT DETAILS
                ========================================= */}

                <div className="mt-6 space-y-3 text-sm">

                  <div className="flex items-center justify-between gap-4 border-b border-white/[0.05] pb-3">

                    <span className="text-xs text-white/30">
                      Primary Mobile
                    </span>

                    <span className="text-right text-white/70">
                      {
                        contact.primaryMobile ||
                        "—"
                      }
                    </span>

                  </div>

                  <div className="flex items-center justify-between gap-4 border-b border-white/[0.05] pb-3">

                    <span className="text-xs text-white/30">
                      Alternate Mobile
                    </span>

                    <span className="text-right text-white/70">
                      {
                        contact.alternateMobile ||
                        "—"
                      }
                    </span>

                  </div>

                  <div className="flex items-center justify-between gap-4 border-b border-white/[0.05] pb-3">

                    <span className="text-xs text-white/30">
                      Email
                    </span>

                    <span className="break-all text-right text-white/70">
                      {
                        contact.email ||
                        "—"
                      }
                    </span>

                  </div>

                </div>

                {/* =========================================
                    ADDRESS
                ========================================= */}

                {(contact.addressLine1 ||
                  contact.addressLine2 ||
                  contact.city ||
                  contact.state ||
                  contact.country ||
                  contact.postalCode) && (

                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">

                    <div className="flex items-center gap-2">

                      <MapPin
                        size={15}
                        className="text-white/30"
                      />

                      <span className="text-xs uppercase tracking-wider text-white/30">
                        Address
                      </span>

                    </div>

                    <div className="mt-3 space-y-1 text-sm text-white/55">

                      {contact.addressLine1 && (
                        <p>
                          {
                            contact.addressLine1
                          }
                        </p>
                      )}

                      {contact.addressLine2 && (
                        <p>
                          {
                            contact.addressLine2
                          }
                        </p>
                      )}

                      {(contact.city ||
                        contact.state) && (
                        <p>
                          {[
                            contact.city,
                            contact.state,
                          ]
                            .filter(
                              Boolean
                            )
                            .join(", ")}
                        </p>
                      )}

                      {(contact.country ||
                        contact.postalCode) && (
                        <p>
                          {[
                            contact.country,
                            contact.postalCode,
                          ]
                            .filter(
                              Boolean
                            )
                            .join(" — ")}
                        </p>
                      )}

                    </div>

                  </div>
                )}

                {/* =========================================
                    ACTIONS
                ========================================= */}

                {(canUpdate ||
                  canDelete) && (

                  <div className="mt-6 flex justify-end gap-2 border-t border-white/5 pt-4">

                    {canUpdate && (
                      <button
                        type="button"
                        onClick={() =>
                          startEdit(
                            contact
                          )
                        }
                        disabled={saving}
                        className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/50 transition hover:text-white disabled:opacity-50"
                      >
                        Edit
                      </button>
                    )}

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() =>
                          deleteContact(
                            contact
                          )
                        }
                        disabled={saving}
                        className="rounded-full border border-red-400/10 px-4 py-2 text-xs text-red-300/70 transition hover:border-red-400/20 hover:text-red-300 disabled:opacity-50"
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
function EmergencyInput({
  label,
  value,
  onChange,
  required = false,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
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
        onChange={(event) =>
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
   EMPLOYMENT HISTORY TAB
========================================================= */

function EmploymentHistoryTab({
  employeeId,
  profile,
}: {
  employeeId: string | null;
  profile: AdminProfile | null;
}) {

  const [history, setHistory] =
    useState<EmployeeEmploymentHistory[]>(
      []
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [form, setForm] =
    useState({
      companyName: "",
      companyLocation: "",
      industry: "",

      jobTitle: "",
      designation: "",
      department: "",
      employmentType: "",

      startDate: "",
      endDate: "",

      lastDrawnDesignation: "",
      lastDrawnSalary: "",

      reasonForLeaving: "",

      reportingManager: "",
      hrContactName: "",
      hrContactEmail: "",
      hrContactMobile: "",

      verificationStatus: "PENDING",
      verificationReference: "",

      active: true,
    });

  /* =======================================================
     PERMISSIONS
  ======================================================= */

  const canView =
    hasAdminPermission(
      profile,
      "EMPLOYEE_EMPLOYMENT_HISTORY_VIEW"
    );

  const canCreate =
    hasAdminPermission(
      profile,
      "EMPLOYEE_EMPLOYMENT_HISTORY_CREATE"
    );

  const canUpdate =
    hasAdminPermission(
      profile,
      "EMPLOYEE_EMPLOYMENT_HISTORY_UPDATE"
    );

  const canDelete =
    hasAdminPermission(
      profile,
      "EMPLOYEE_EMPLOYMENT_HISTORY_DELETE"
    );

  /* =======================================================
     RESET FORM
  ======================================================= */

  function resetForm() {

    setForm({
      companyName: "",
      companyLocation: "",
      industry: "",

      jobTitle: "",
      designation: "",
      department: "",
      employmentType: "",

      startDate: "",
      endDate: "",

      lastDrawnDesignation: "",
      lastDrawnSalary: "",

      reasonForLeaving: "",

      reportingManager: "",
      hrContactName: "",
      hrContactEmail: "",
      hrContactMobile: "",

      verificationStatus: "PENDING",
      verificationReference: "",

      active: true,
    });

    setEditingId(null);
  }

  /* =======================================================
     FORM OPEN
  ======================================================= */

  function openCreateForm() {

    resetForm();

    setShowForm(true);

    setError("");
  }

  /* =======================================================
     FORM UPDATE
  ======================================================= */

  function updateForm(
    field: keyof typeof form,
    value: string | boolean
  ) {

    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /* =======================================================
     AUTH HEADER
  ======================================================= */

  function getAuthHeader(): string {

    const authHeader =
      getAdminAuthHeader();

    if (!authHeader) {

      throw new Error(
        "Administrator authentication is missing."
      );
    }

    return authHeader;
  }

  /* =======================================================
     LOAD HISTORY
  ======================================================= */

  async function loadHistory() {

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
        getAuthHeader();

      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/employees/${employeeId}/employment-history`,
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
          `Unable to load employment history (${response.status}).`
        );
      }

      const data =
        await response.json();

      setHistory(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Unable to load employment history:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load employment history."
      );

    } finally {

      setLoading(false);
    }
  }

  /* =======================================================
     CREATE / UPDATE
  ======================================================= */

  async function submitHistory(
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
        getAuthHeader();

      if (
        form.endDate &&
        form.startDate &&
        form.endDate <
          form.startDate
      ) {

        throw new Error(
          "End date cannot be before start date."
        );
      }

      const salary =
        form.lastDrawnSalary.trim() === ""
          ? null
          : Number(
              form.lastDrawnSalary
            );

      if (
        salary !== null &&
        Number.isNaN(salary)
      ) {

        throw new Error(
          "Last drawn salary must be a valid number."
        );
      }

      if (
        salary !== null &&
        salary < 0
      ) {

        throw new Error(
          "Last drawn salary cannot be negative."
        );
      }

      const payload = {
        companyName:
          form.companyName.trim(),

        companyLocation:
          form.companyLocation.trim() ||
          null,

        industry:
          form.industry.trim() ||
          null,

        jobTitle:
          form.jobTitle.trim(),

        designation:
          form.designation.trim() ||
          null,

        department:
          form.department.trim() ||
          null,

        employmentType:
          form.employmentType.trim() ||
          null,

        startDate:
          form.startDate ||
          null,

        endDate:
          form.endDate ||
          null,

        lastDrawnDesignation:
          form.lastDrawnDesignation.trim() ||
          null,

        lastDrawnSalary:
          salary,

        reasonForLeaving:
          form.reasonForLeaving.trim() ||
          null,

        reportingManager:
          form.reportingManager.trim() ||
          null,

        hrContactName:
          form.hrContactName.trim() ||
          null,

        hrContactEmail:
          form.hrContactEmail.trim() ||
          null,

        hrContactMobile:
          form.hrContactMobile.trim() ||
          null,

        verificationStatus:
          form.verificationStatus,

        verificationReference:
          form.verificationReference.trim() ||
          null,

        active:
          form.active,
      };

      const url =
        editingId === null
          ? `${API_BASE_URL}/api/admin/employees/${employeeId}/employment-history`
          : `${API_BASE_URL}/api/admin/employees/${employeeId}/employment-history/${editingId}`;

      const response =
        await fetch(
          url,
          {
            method:
              editingId === null
                ? "POST"
                : "PUT",

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
          `Unable to save employment history (${response.status}).`
        );
      }

      resetForm();

      setShowForm(false);

      await loadHistory();

    } catch (err) {

      console.error(
        "Unable to save employment history:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save employment history."
      );

    } finally {

      setSaving(false);
    }
  }

  /* =======================================================
     EDIT
  ======================================================= */

  function startEdit(
    item: EmployeeEmploymentHistory
  ) {

    if (!canUpdate) {
      return;
    }

    setEditingId(
      item.id
    );

    setForm({
      companyName:
        item.companyName || "",

      companyLocation:
        item.companyLocation || "",

      industry:
        item.industry || "",

      jobTitle:
        item.jobTitle || "",

      designation:
        item.designation || "",

      department:
        item.department || "",

      employmentType:
        item.employmentType || "",

      startDate:
        item.startDate || "",

      endDate:
        item.endDate || "",

      lastDrawnDesignation:
        item.lastDrawnDesignation || "",

      lastDrawnSalary:
        item.lastDrawnSalary === null ||
        item.lastDrawnSalary === undefined
          ? ""
          : String(
              item.lastDrawnSalary
            ),

      reasonForLeaving:
        item.reasonForLeaving || "",

      reportingManager:
        item.reportingManager || "",

      hrContactName:
        item.hrContactName || "",

      hrContactEmail:
        item.hrContactEmail || "",

      hrContactMobile:
        item.hrContactMobile || "",

      verificationStatus:
        item.verificationStatus ||
        "PENDING",

      verificationReference:
        item.verificationReference || "",

      active:
        item.active,
    });

    setShowForm(true);

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =======================================================
     DELETE
  ======================================================= */

  async function deleteHistory(
    item: EmployeeEmploymentHistory
  ) {

    if (
      !employeeId ||
      !canDelete
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete employment history for ${item.companyName}?`
      );

    if (!confirmed) {
      return;
    }

    setError("");

    try {

      const authHeader =
        getAuthHeader();

      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/employees/${employeeId}/employment-history/${item.id}`,
          {
            method: "DELETE",

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
          `Unable to delete employment history (${response.status}).`
        );
      }

      await loadHistory();

    } catch (err) {

      console.error(
        "Unable to delete employment history:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete employment history."
      );
    }
  }

  /* =======================================================
     LOAD
  ======================================================= */

  useEffect(() => {

    loadHistory();

  }, [
    employeeId,
    canView,
  ]);

  /* =======================================================
     PERMISSION
  ======================================================= */

  if (!canView) {

    return (
      <PlaceholderTab
        icon={
          <BriefcaseBusiness
            size={28}
          />
        }
        title="Employment History"
        description="You do not have permission to view employee employment history."
      />
    );
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (
      <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] py-20 text-white/40">

        <Loader2
          size={20}
          className="mr-3 animate-spin"
        />

        Loading employment history...

      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-5">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h2 className="text-lg font-medium">
            Employment History
          </h2>

          <p className="mt-1 text-sm text-white/35">
            Previous employers, positions,
            employment periods and verification
            records.
          </p>

        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={() =>
              loadHistory()
            }
            className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm text-white/60 transition hover:border-white/20 hover:text-white"
          >

            <RefreshCw size={15} />

            Refresh

          </button>

          {canCreate && (
            <button
              type="button"
              onClick={() =>
                showForm
                  ? (
                      resetForm(),
                      setShowForm(false)
                    )
                  : openCreateForm()
              }
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              {showForm
                ? "Cancel"
                : "+ Add Employment"}
            </button>
          )}

        </div>

      </div>

      {/* ===================================================
          ERROR
      =================================================== */}

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

            <X size={16} />

          </button>

        </div>
      )}

      {/* ===================================================
          FORM
      =================================================== */}

      {showForm && (
        <form
          onSubmit={submitHistory}
          className="rounded-3xl border border-white/10 bg-white/[0.02] p-6"
        >

          <div className="mb-6">

            <h3 className="text-base font-medium">

              {editingId === null
                ? "Add Employment History"
                : "Edit Employment History"}

            </h3>

            <p className="mt-1 text-sm text-white/35">
              Enter the previous employment
              details.
            </p>

          </div>

          {/* ORGANIZATION */}

          <div className="mb-7">

            <p className="mb-4 text-xs uppercase tracking-wider text-white/25">
              Organization
            </p>

            <div className="grid gap-5 md:grid-cols-2">

              <EmploymentInput
                label="Company Name"
                value={
                  form.companyName
                }
                onChange={(value) =>
                  updateForm(
                    "companyName",
                    value
                  )
                }
                required
                placeholder="ABC Technologies Pvt Ltd"
              />

              <EmploymentInput
                label="Company Location"
                value={
                  form.companyLocation
                }
                onChange={(value) =>
                  updateForm(
                    "companyLocation",
                    value
                  )
                }
                placeholder="Gurugram, Haryana"
              />

              <EmploymentInput
                label="Industry"
                value={
                  form.industry
                }
                onChange={(value) =>
                  updateForm(
                    "industry",
                    value
                  )
                }
                placeholder="Information Technology"
              />

              <EmploymentInput
                label="Employment Type"
                value={
                  form.employmentType
                }
                onChange={(value) =>
                  updateForm(
                    "employmentType",
                    value
                  )
                }
                placeholder="FULL_TIME"
              />

            </div>

          </div>

          {/* POSITION */}

          <div className="mb-7">

            <p className="mb-4 text-xs uppercase tracking-wider text-white/25">
              Position
            </p>

            <div className="grid gap-5 md:grid-cols-2">

              <EmploymentInput
                label="Job Title"
                value={
                  form.jobTitle
                }
                onChange={(value) =>
                  updateForm(
                    "jobTitle",
                    value
                  )
                }
                required
                placeholder="Senior Software Engineer"
              />

              <EmploymentInput
                label="Designation"
                value={
                  form.designation
                }
                onChange={(value) =>
                  updateForm(
                    "designation",
                    value
                  )
                }
                placeholder="Technical Lead"
              />

              <EmploymentInput
                label="Department"
                value={
                  form.department
                }
                onChange={(value) =>
                  updateForm(
                    "department",
                    value
                  )
                }
                placeholder="Engineering"
              />

              <EmploymentInput
                label="Last Drawn Designation"
                value={
                  form.lastDrawnDesignation
                }
                onChange={(value) =>
                  updateForm(
                    "lastDrawnDesignation",
                    value
                  )
                }
                placeholder="Technical Lead"
              />

            </div>

          </div>

          {/* PERIOD */}

          <div className="mb-7">

            <p className="mb-4 text-xs uppercase tracking-wider text-white/25">
              Employment Period
            </p>

            <div className="grid gap-5 md:grid-cols-2">

              <EmploymentInput
                label="Start Date"
                type="date"
                value={
                  form.startDate
                }
                onChange={(value) =>
                  updateForm(
                    "startDate",
                    value
                  )
                }
              />

              <EmploymentInput
                label="End Date"
                type="date"
                value={
                  form.endDate
                }
                onChange={(value) =>
                  updateForm(
                    "endDate",
                    value
                  )
                }
              />

              <EmploymentInput
                label="Last Drawn Salary"
                type="number"
                value={
                  form.lastDrawnSalary
                }
                onChange={(value) =>
                  updateForm(
                    "lastDrawnSalary",
                    value
                  )
                }
                placeholder="850000"
              />

              <EmploymentInput
                label="Reason For Leaving"
                value={
                  form.reasonForLeaving
                }
                onChange={(value) =>
                  updateForm(
                    "reasonForLeaving",
                    value
                  )
                }
                placeholder="Career growth"
              />

            </div>

          </div>

          {/* CONTACT */}

          <div className="mb-7">

            <p className="mb-4 text-xs uppercase tracking-wider text-white/25">
              Previous Employer Contacts
            </p>

            <div className="grid gap-5 md:grid-cols-2">

              <EmploymentInput
                label="Reporting Manager"
                value={
                  form.reportingManager
                }
                onChange={(value) =>
                  updateForm(
                    "reportingManager",
                    value
                  )
                }
                placeholder="Manager name"
              />

              <EmploymentInput
                label="HR Contact Name"
                value={
                  form.hrContactName
                }
                onChange={(value) =>
                  updateForm(
                    "hrContactName",
                    value
                  )
                }
                placeholder="HR name"
              />

              <EmploymentInput
                label="HR Contact Email"
                type="email"
                value={
                  form.hrContactEmail
                }
                onChange={(value) =>
                  updateForm(
                    "hrContactEmail",
                    value
                  )
                }
                placeholder="hr@example.com"
              />

              <EmploymentInput
                label="HR Contact Mobile"
                value={
                  form.hrContactMobile
                }
                onChange={(value) =>
                  updateForm(
                    "hrContactMobile",
                    value
                  )
                }
                placeholder="9876543210"
              />

            </div>

          </div>

          {/* VERIFICATION */}

          <div>

            <p className="mb-4 text-xs uppercase tracking-wider text-white/25">
              Verification
            </p>

            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-xs uppercase tracking-wider text-white/35">
                  Verification Status
                </label>

                <select
                  value={
                    form.verificationStatus
                  }
                  onChange={(event) =>
                    updateForm(
                      "verificationStatus",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                >

                  <option value="PENDING">
                    PENDING
                  </option>

                  <option value="VERIFIED">
                    VERIFIED
                  </option>

                  <option value="REJECTED">
                    REJECTED
                  </option>

                </select>

              </div>

              <EmploymentInput
                label="Verification Reference"
                value={
                  form.verificationReference
                }
                onChange={(value) =>
                  updateForm(
                    "verificationReference",
                    value
                  )
                }
                placeholder="Reference / verification ID"
              />

              <label className="flex items-center gap-3 self-end pb-1 text-sm text-white/60">

                <input
                  type="checkbox"
                  checked={
                    form.active
                  }
                  onChange={(event) =>
                    updateForm(
                      "active",
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-white/20 bg-black"
                />

                Active employment record

              </label>

            </div>

          </div>

          {/* FORM ACTIONS */}

          <div className="mt-7 flex justify-end gap-3 border-t border-white/5 pt-5">

            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
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
                : editingId === null
                  ? "Save Employment"
                  : "Update Employment"}

            </button>

          </div>

        </form>
      )}

      {/* ===================================================
          EMPTY
      =================================================== */}

      {history.length === 0 ? (

        <PlaceholderTab
          icon={
            <BriefcaseBusiness
              size={28}
            />
          }
          title="No Employment History"
          description="No previous employment records have been added for this employee."
        />

      ) : (

        <div className="space-y-5">

          {history.map(
            (item) => (

              <div
                key={item.id}
                className="rounded-3xl border border-white/10 bg-white/[0.02] p-6"
              >

                {/* HEADER */}

                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/40">

                        <BriefcaseBusiness
                          size={18}
                        />

                      </div>

                      <div>

                        <h3 className="font-medium text-white">

                          {item.companyName}

                        </h3>

                        <p className="mt-1 text-sm text-white/40">

                          {item.jobTitle}

                          {item.designation
                            ? ` • ${item.designation}`
                            : ""}

                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="flex flex-wrap items-center gap-2">

                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-wider ${
                        item.active
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                          : "border-white/10 bg-white/5 text-white/30"
                      }`}
                    >

                      {item.active
                        ? "Active"
                        : "Inactive"}

                    </span>

                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-wider ${
                        item.verificationStatus ===
                        "VERIFIED"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                          : item.verificationStatus ===
                            "REJECTED"
                            ? "border-red-500/20 bg-red-500/10 text-red-300"
                            : "border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
                      }`}
                    >

                      {item.verificationStatus}

                    </span>

                  </div>

                </div>

                {/* DETAILS */}

                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                  <EmploymentInfo
                    label="Company Location"
                    value={
                      item.companyLocation
                    }
                  />

                  <EmploymentInfo
                    label="Industry"
                    value={
                      item.industry
                    }
                  />

                  <EmploymentInfo
                    label="Department"
                    value={
                      item.department
                    }
                  />

                  <EmploymentInfo
                    label="Employment Type"
                    value={
                      item.employmentType
                    }
                  />

                  <EmploymentInfo
                    label="Start Date"
                    value={
                      formatDate(
                        item.startDate
                      )
                    }
                  />

                  <EmploymentInfo
                    label="End Date"
                    value={
                      formatDate(
                        item.endDate
                      )
                    }
                  />

                  <EmploymentInfo
                    label="Last Drawn Designation"
                    value={
                      item.lastDrawnDesignation
                    }
                  />

                  <EmploymentInfo
                    label="Last Drawn Salary"
                    value={
                      item.lastDrawnSalary ===
                      null
                        ? null
                        : String(
                            item.lastDrawnSalary
                          )
                    }
                  />

                  <EmploymentInfo
                    label="Reporting Manager"
                    value={
                      item.reportingManager
                    }
                  />

                </div>

                {/* REASON */}

                {item.reasonForLeaving && (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">

                    <p className="text-[10px] uppercase tracking-wider text-white/25">
                      Reason For Leaving
                    </p>

                    <p className="mt-2 text-sm text-white/60">
                      {
                        item.reasonForLeaving
                      }
                    </p>

                  </div>
                )}

                {/* HR CONTACT */}

                {(item.hrContactName ||
                  item.hrContactEmail ||
                  item.hrContactMobile) && (

                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">

                    <p className="text-[10px] uppercase tracking-wider text-white/25">
                      HR Contact
                    </p>

                    <div className="mt-3 grid gap-3 md:grid-cols-3">

                      <EmploymentInfo
                        label="Name"
                        value={
                          item.hrContactName
                        }
                      />

                      <EmploymentInfo
                        label="Email"
                        value={
                          item.hrContactEmail
                        }
                      />

                      <EmploymentInfo
                        label="Mobile"
                        value={
                          item.hrContactMobile
                        }
                      />

                    </div>

                  </div>
                )}

                {/* VERIFICATION */}

                {item.verificationReference && (
                  <div className="mt-5">

                    <EmploymentInfo
                      label="Verification Reference"
                      value={
                        item.verificationReference
                      }
                    />

                  </div>
                )}

                {/* ACTIONS */}

                {(canUpdate ||
                  canDelete) && (

                  <div className="mt-6 flex justify-end gap-2 border-t border-white/5 pt-4">

                    {canUpdate && (
                      <button
                        type="button"
                        onClick={() =>
                          startEdit(item)
                        }
                        className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/50 hover:text-white"
                      >
                        Edit
                      </button>
                    )}

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() =>
                          deleteHistory(item)
                        }
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
   EMPLOYMENT INPUT
========================================================= */

function EmploymentInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
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
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        required={required}
        min={
          type === "number"
            ? "0"
            : undefined
        }
        step={
          type === "number"
            ? "0.01"
            : undefined
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/30"
      />

    </div>
  );
}

/* =========================================================
   EMPLOYMENT INFO
========================================================= */

function EmploymentInfo({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {

  return (
    <div>

      <p className="text-[10px] uppercase tracking-wider text-white/25">
        {label}
      </p>

      <p className="mt-1 text-sm text-white/65">
        {value || "—"}
      </p>

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