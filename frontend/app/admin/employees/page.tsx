"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  Plus,
  Users,
  Building2,
  BriefcaseBusiness,
  MapPin,
  RefreshCw,
  ChevronRight,
  UserRound,
  X,
  Save,
  Loader2,
} from "lucide-react";

import {
  getAdminProfile,
  hasAdminPermission,
  type AdminProfile,
} from "@/lib/adminAuth";

import API_BASE_URL from "@/lib/api";

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

type EmployeeForm = {
  employeeCode: string;

  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;

  dateOfBirth: string;

  gender: string;
  maritalStatus: string;
  nationality: string;

  officialEmail: string;
  personalEmail: string;

  primaryMobile: string;
  alternateMobile: string;

  dateOfJoining: string;

  employmentType: string;
  employmentStatus: string;

  department: string;
  designation: string;
  jobTitle: string;
  grade: string;

  workLocation: string;
  branch: string;
  workMode: string;

  reportingManagerId: string;
  functionalManagerId: string;

  profileStatus: string;
};

const EMPTY_FORM: EmployeeForm = {
  employeeCode: "",

  firstName: "",
  middleName: "",
  lastName: "",
  preferredName: "",

  dateOfBirth: "",

  gender: "",
  maritalStatus: "",
  nationality: "INDIAN",

  officialEmail: "",
  personalEmail: "",

  primaryMobile: "",
  alternateMobile: "",

  dateOfJoining: "",

  employmentType: "FULL_TIME",
  employmentStatus: "ACTIVE",

  department: "",
  designation: "",
  jobTitle: "",
  grade: "",

  workLocation: "",
  branch: "",
  workMode: "OFFICE",

  reportingManagerId: "",
  functionalManagerId: "",

  profileStatus: "ACTIVE",
};

const VIEW_PERMISSION =
  "EMPLOYEE_RECORDS_VIEW";

const CREATE_PERMISSION =
  "EMPLOYEE_RECORDS_CREATE";

const UPDATE_PERMISSION =
  "EMPLOYEE_RECORDS_UPDATE";

function displayName(employee: Employee) {
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

function statusClass(status: string | null) {
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

export default function EmployeeManagementPage() {

  const [profile, setProfile] =
    useState<AdminProfile | null>(null);

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [departmentFilter, setDepartmentFilter] =
    useState("ALL");

  const [showCreate, setShowCreate] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState<EmployeeForm>(EMPTY_FORM);

  const canView =
    hasAdminPermission(
      profile,
      VIEW_PERMISSION
    );

  const canCreate =
    hasAdminPermission(
      profile,
      CREATE_PERMISSION
    );

  const canUpdate =
    hasAdminPermission(
      profile,
      UPDATE_PERMISSION
    );

  async function loadEmployees(
    showRefresh = false
  ) {

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

      setProfile(adminProfile);

      if (
        !hasAdminPermission(
          adminProfile,
          VIEW_PERMISSION
        )
      ) {
        throw new Error(
          "You do not have permission to view employees."
        );
      }

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
          `${API_BASE_URL}/api/admin/employees`,
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
          `Unable to load employees (${response.status}).`
        );
      }

      const data =
        await response.json();

      setEmployees(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Unable to load employees:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load employees."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  const departments =
    useMemo(() => {

      return [
        "ALL",
        ...Array.from(
          new Set(
            employees
              .map(
                (employee) =>
                  employee.department
              )
              .filter(Boolean) as string[]
          )
        ).sort(),
      ];

    }, [employees]);

  const filteredEmployees =
    useMemo(() => {

      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return employees.filter(
        (employee) => {

          const matchesSearch =
            !normalizedSearch ||
            [
              employee.employeeCode,
              displayName(employee),
              employee.officialEmail,
              employee.department,
              employee.designation,
              employee.jobTitle,
              employee.primaryMobile,
            ]
              .filter(Boolean)
              .some(
                (value) =>
                  value!
                    .toLowerCase()
                    .includes(
                      normalizedSearch
                    )
              );

          const matchesStatus =
            statusFilter === "ALL" ||
            employee.employmentStatus ===
              statusFilter;

          const matchesDepartment =
            departmentFilter === "ALL" ||
            employee.department ===
              departmentFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesDepartment
          );
        }
      );

    }, [
      employees,
      search,
      statusFilter,
      departmentFilter,
    ]);

  function updateField(
    field: keyof EmployeeForm,
    value: string
  ) {

    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    );
  }

  async function createEmployee(
    event: React.FormEvent
  ) {

    event.preventDefault();

    if (!canCreate) {
      setError(
        "You do not have permission to create employees."
      );
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

      const body = {
        employeeCode:
          form.employeeCode,

        firstName:
          form.firstName,

        middleName:
          form.middleName || null,

        lastName:
          form.lastName,

        preferredName:
          form.preferredName || null,

        dateOfBirth:
          form.dateOfBirth || null,

        gender:
          form.gender || null,

        maritalStatus:
          form.maritalStatus || null,

        nationality:
          form.nationality || null,

        officialEmail:
          form.officialEmail || null,

        personalEmail:
          form.personalEmail || null,

        primaryMobile:
          form.primaryMobile || null,

        alternateMobile:
          form.alternateMobile || null,

        dateOfJoining:
          form.dateOfJoining || null,

        employmentType:
          form.employmentType || null,

        employmentStatus:
          form.employmentStatus || null,

        department:
          form.department || null,

        designation:
          form.designation || null,

        jobTitle:
          form.jobTitle || null,

        grade:
          form.grade || null,

        workLocation:
          form.workLocation || null,

        branch:
          form.branch || null,

        workMode:
          form.workMode || null,

        reportingManagerId:
          form.reportingManagerId
            ? Number(
                form.reportingManagerId
              )
            : null,

        functionalManagerId:
          form.functionalManagerId
            ? Number(
                form.functionalManagerId
              )
            : null,
      };

      const response =
        await fetch(
          `${API_BASE_URL}/api/admin/employees`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Basic ${credentials}`,

              "Content-Type":
                "application/json",

              Accept:
                "application/json",
            },

            body:
              JSON.stringify(body),
          }
        );

      if (!response.ok) {

        const message =
          await response.text();

        throw new Error(
          message ||
          `Unable to create employee (${response.status}).`
        );
      }

      setForm(
        EMPTY_FORM
      );

      setShowCreate(false);

      await loadEmployees(
        true
      );

    } catch (err) {

      console.error(
        "Unable to create employee:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create employee."
      );

    } finally {

      setSaving(false);
    }
  }

  if (loading) {

    return (
      <main className="min-h-screen bg-[#050505] text-white">

        <div className="flex min-h-screen items-center justify-center">

          <div className="flex items-center gap-3 text-white/50">

            <Loader2
              className="animate-spin"
              size={20}
            />

            Loading employees...

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      <div className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">

                <Users
                  size={21}
                  className="text-white/70"
                />

              </div>

              <div>

                <h1 className="text-2xl font-semibold tracking-tight">
                  Employee Management
                </h1>

                <p className="mt-1 text-sm text-white/40">
                  Manage VAELIS employee records,
                  organization and workforce data.
                </p>

              </div>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                loadEmployees(true)
              }
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/[0.06] disabled:opacity-50"
            >

              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh

            </button>

            {canCreate && (
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setForm(
                    EMPTY_FORM
                  );
                  setShowCreate(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
              >

                <Plus size={17} />

                Add Employee

              </button>
            )}

          </div>

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
              <X size={16} />
            </button>

          </div>
        )}

        {!canView ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">

            <UserRound
              size={40}
              className="mx-auto text-white/20"
            />

            <h2 className="mt-5 text-lg font-medium">
              Employee access unavailable
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Your administrator account does not
              have employee viewing permission.
            </p>

          </div>
        ) : (
          <>
            {/* =============================================
                SUMMARY
            ============================================= */}

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <SummaryCard
                icon={
                  <Users size={18} />
                }
                label="Total Employees"
                value={
                  employees.length
                }
              />

              <SummaryCard
                icon={
                  <BriefcaseBusiness
                    size={18}
                  />
                }
                label="Active"
                value={
                  employees.filter(
                    (employee) =>
                      employee.employmentStatus ===
                      "ACTIVE"
                  ).length
                }
              />

              <SummaryCard
                icon={
                  <Building2 size={18} />
                }
                label="Departments"
                value={
                  departments.length - 1
                }
              />

              <SummaryCard
                icon={
                  <MapPin size={18} />
                }
                label="Locations"
                value={
                  new Set(
                    employees
                      .map(
                        (employee) =>
                          employee.workLocation
                      )
                      .filter(Boolean)
                  ).size
                }
              />

            </div>

            {/* =============================================
                FILTER BAR
            ============================================= */}

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-4">

              <div className="grid gap-3 lg:grid-cols-[1fr_190px_190px_auto]">

                <div className="relative">

                  <Search
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                  />

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search employee, code, email, department..."
                    className="w-full rounded-xl border border-white/10 bg-black px-11 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
                  />

                </div>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                  className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
                >

                  <option value="ALL">
                    All Statuses
                  </option>

                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="INACTIVE">
                    Inactive
                  </option>

                  <option value="TERMINATED">
                    Terminated
                  </option>

                </select>

                <select
                  value={
                    departmentFilter
                  }
                  onChange={(event) =>
                    setDepartmentFilter(
                      event.target.value
                    )
                  }
                  className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none"
                >

                  {departments.map(
                    (department) => (
                      <option
                        key={department}
                        value={department}
                      >
                        {department ===
                        "ALL"
                          ? "All Departments"
                          : department}
                      </option>
                    )
                  )}

                </select>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter(
                      "ALL"
                    );
                    setDepartmentFilter(
                      "ALL"
                    );
                  }}
                  className="rounded-xl border border-white/10 px-4 py-3 text-sm text-white/50 transition hover:bg-white/[0.04] hover:text-white"
                >
                  Reset
                </button>

              </div>

            </div>

            {/* =============================================
                EMPLOYEE TABLE
            ============================================= */}

            <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1050px]">

                  <thead>

                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/30">

                      <th className="px-6 py-4 font-medium">
                        Employee
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Organization
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Location
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Employment
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right font-medium">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredEmployees.length ===
                    0 ? (
                      <tr>

                        <td
                          colSpan={6}
                          className="px-6 py-16 text-center"
                        >

                          <Users
                            size={32}
                            className="mx-auto text-white/15"
                          />

                          <p className="mt-4 text-sm text-white/40">
                            No employees found.
                          </p>

                        </td>

                      </tr>
                    ) : (
                      filteredEmployees.map(
                        (employee) => (
                          <tr
                            key={
                              employee.id
                            }
                            className="border-b border-white/[0.06] transition hover:bg-white/[0.025]"
                          >

                            <td className="px-6 py-5">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sm font-medium text-white/60">

                                  {employee.firstName
                                    ?.charAt(
                                      0
                                    )
                                    ?.toUpperCase()}

                                </div>

                                <div>

                                  <p className="font-medium">
                                    {displayName(
                                      employee
                                    )}
                                  </p>

                                  <p className="mt-1 text-xs text-white/35">
                                    {
                                      employee.employeeCode
                                    }
                                  </p>

                                </div>

                              </div>

                            </td>

                            <td className="px-6 py-5">

                              <p className="text-sm text-white/80">
                                {
                                  employee.designation ||
                                  employee.jobTitle ||
                                  "—"
                                }
                              </p>

                              <p className="mt-1 text-xs text-white/35">
                                {
                                  employee.department ||
                                  "—"
                                }

                              </p>

                            </td>

                            <td className="px-6 py-5">

                              <p className="text-sm text-white/70">
                                {
                                  employee.workLocation ||
                                  "—"
                                }
                              </p>

                              <p className="mt-1 text-xs text-white/35">
                                {
                                  employee.branch ||
                                  employee.workMode ||
                                  "—"
                                }
                              </p>

                            </td>

                            <td className="px-6 py-5">

                              <p className="text-sm text-white/70">
                                {
                                  employee.employmentType ||
                                  "—"
                                }
                              </p>

                              <p className="mt-1 text-xs text-white/35">
                                Joined{" "}
                                {
                                  employee.dateOfJoining ||
                                  "—"
                                }
                              </p>

                            </td>

                            <td className="px-6 py-5">

                              <span
                                className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${statusClass(
                                  employee.employmentStatus
                                )}`}
                              >
                                {
                                  employee.employmentStatus ||
                                  "UNKNOWN"
                                }
                              </span>

                            </td>

                            <td className="px-6 py-5 text-right">

                              <button
                                type="button"
                                onClick={() =>
                                  window.location.href =
                                    `/admin/employees/${employee.id}`
                                }
                                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/60 transition hover:bg-white/[0.05] hover:text-white"
                              >

                                View

                                <ChevronRight
                                  size={14}
                                />

                              </button>

                            </td>

                          </tr>
                        )
                      )
                    )}

                  </tbody>

                </table>

              </div>

              <div className="border-t border-white/[0.06] px-6 py-4 text-xs text-white/30">

                Showing{" "}
                <span className="text-white/60">
                  {
                    filteredEmployees.length
                  }
                </span>{" "}
                of{" "}
                <span className="text-white/60">
                  {employees.length}
                </span>{" "}
                employees

              </div>

            </div>
          </>
        )}

      </div>

      {/* ===================================================
          CREATE EMPLOYEE MODAL
      =================================================== */}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 px-4 py-8 backdrop-blur-sm">

          <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-2xl">

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

              <div>

                <h2 className="text-xl font-semibold">
                  Add Employee
                </h2>

                <p className="mt-1 text-sm text-white/35">
                  Create a new employee record.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCreate(false)
                }
                className="rounded-xl p-2 text-white/40 hover:bg-white/[0.05] hover:text-white"
              >
                <X size={19} />
              </button>

            </div>

            <form
              onSubmit={
                createEmployee
              }
              className="max-h-[75vh] overflow-y-auto px-6 py-6"
            >

              <FormSection title="Identity">

                <Field
                  label="Employee Code"
                  value={
                    form.employeeCode
                  }
                  onChange={(value) =>
                    updateField(
                      "employeeCode",
                      value
                    )
                  }
                  required
                />

                <Field
                  label="First Name"
                  value={
                    form.firstName
                  }
                  onChange={(value) =>
                    updateField(
                      "firstName",
                      value
                    )
                  }
                  required
                />

                <Field
                  label="Middle Name"
                  value={
                    form.middleName
                  }
                  onChange={(value) =>
                    updateField(
                      "middleName",
                      value
                    )
                  }
                />

                <Field
                  label="Last Name"
                  value={
                    form.lastName
                  }
                  onChange={(value) =>
                    updateField(
                      "lastName",
                      value
                    )
                  }
                  required
                />

                <Field
                  label="Preferred Name"
                  value={
                    form.preferredName
                  }
                  onChange={(value) =>
                    updateField(
                      "preferredName",
                      value
                    )
                  }
                />

                <Field
                  label="Date of Birth"
                  type="date"
                  value={
                    form.dateOfBirth
                  }
                  onChange={(value) =>
                    updateField(
                      "dateOfBirth",
                      value
                    )
                  }
                />

                <SelectField
                  label="Gender"
                  value={
                    form.gender
                  }
                  onChange={(value) =>
                    updateField(
                      "gender",
                      value
                    )
                  }
                  options={[
                    "MALE",
                    "FEMALE",
                    "OTHER",
                  ]}
                />

                <SelectField
                  label="Marital Status"
                  value={
                    form.maritalStatus
                  }
                  onChange={(value) =>
                    updateField(
                      "maritalStatus",
                      value
                    )
                  }
                  options={[
                    "SINGLE",
                    "MARRIED",
                    "DIVORCED",
                    "WIDOWED",
                  ]}
                />

                <Field
                  label="Nationality"
                  value={
                    form.nationality
                  }
                  onChange={(value) =>
                    updateField(
                      "nationality",
                      value
                    )
                  }
                />

              </FormSection>

              <FormSection title="Contact">

                <Field
                  label="Official Email"
                  type="email"
                  value={
                    form.officialEmail
                  }
                  onChange={(value) =>
                    updateField(
                      "officialEmail",
                      value
                    )
                  }
                />

                <Field
                  label="Personal Email"
                  type="email"
                  value={
                    form.personalEmail
                  }
                  onChange={(value) =>
                    updateField(
                      "personalEmail",
                      value
                    )
                  }
                />

                <Field
                  label="Primary Mobile"
                  value={
                    form.primaryMobile
                  }
                  onChange={(value) =>
                    updateField(
                      "primaryMobile",
                      value
                    )
                  }
                />

                <Field
                  label="Alternate Mobile"
                  value={
                    form.alternateMobile
                  }
                  onChange={(value) =>
                    updateField(
                      "alternateMobile",
                      value
                    )
                  }
                />

              </FormSection>

              <FormSection title="Employment">

                <Field
                  label="Date of Joining"
                  type="date"
                  value={
                    form.dateOfJoining
                  }
                  onChange={(value) =>
                    updateField(
                      "dateOfJoining",
                      value
                    )
                  }
                />

                <SelectField
                  label="Employment Type"
                  value={
                    form.employmentType
                  }
                  onChange={(value) =>
                    updateField(
                      "employmentType",
                      value
                    )
                  }
                  options={[
                    "FULL_TIME",
                    "PART_TIME",
                    "CONTRACT",
                    "INTERN",
                    "CONSULTANT",
                  ]}
                />

                <SelectField
                  label="Employment Status"
                  value={
                    form.employmentStatus
                  }
                  onChange={(value) =>
                    updateField(
                      "employmentStatus",
                      value
                    )
                  }
                  options={[
                    "ACTIVE",
                    "INACTIVE",
                    "TERMINATED",
                  ]}
                />

                <Field
                  label="Department"
                  value={
                    form.department
                  }
                  onChange={(value) =>
                    updateField(
                      "department",
                      value
                    )
                  }
                />

                <Field
                  label="Designation"
                  value={
                    form.designation
                  }
                  onChange={(value) =>
                    updateField(
                      "designation",
                      value
                    )
                  }
                />

                <Field
                  label="Job Title"
                  value={
                    form.jobTitle
                  }
                  onChange={(value) =>
                    updateField(
                      "jobTitle",
                      value
                    )
                  }
                />

                <Field
                  label="Grade"
                  value={
                    form.grade
                  }
                  onChange={(value) =>
                    updateField(
                      "grade",
                      value
                    )
                  }
                />

                <Field
                  label="Work Location"
                  value={
                    form.workLocation
                  }
                  onChange={(value) =>
                    updateField(
                      "workLocation",
                      value
                    )
                  }
                />

                <Field
                  label="Branch"
                  value={
                    form.branch
                  }
                  onChange={(value) =>
                    updateField(
                      "branch",
                      value
                    )
                  }
                />

                <SelectField
                  label="Work Mode"
                  value={
                    form.workMode
                  }
                  onChange={(value) =>
                    updateField(
                      "workMode",
                      value
                    )
                  }
                  options={[
                    "OFFICE",
                    "REMOTE",
                    "HYBRID",
                  ]}
                />

              </FormSection>

              <FormSection title="Reporting Structure">

                <Field
                  label="Reporting Manager ID"
                  type="number"
                  value={
                    form.reportingManagerId
                  }
                  onChange={(value) =>
                    updateField(
                      "reportingManagerId",
                      value
                    )
                  }
                />

                <Field
                  label="Functional Manager ID"
                  type="number"
                  value={
                    form.functionalManagerId
                  }
                  onChange={(value) =>
                    updateField(
                      "functionalManagerId",
                      value
                    )
                  }
                />

              </FormSection>

              <div className="mt-8 flex justify-end gap-3 border-t border-white/10 pt-5">

                <button
                  type="button"
                  onClick={() =>
                    setShowCreate(false)
                  }
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/60 hover:bg-white/[0.04]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black disabled:opacity-50"
                >

                  {saving ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={16} />
                  )}

                  {saving
                    ? "Creating..."
                    : "Create Employee"}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

      <div className="flex items-center justify-between">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/50">
          {icon}
        </div>

        <span className="text-2xl font-semibold">
          {value}
        </span>

      </div>

      <p className="mt-4 text-xs uppercase tracking-wider text-white/30">
        {label}
      </p>

    </div>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {

  return (
    <section className="mb-8">

      <h3 className="mb-4 text-sm font-medium text-white/70">
        {title}
      </h3>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {children}
      </div>

    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {

  return (
    <label className="block">

      <span className="mb-2 block text-xs text-white/45">
        {label}
        {required && (
          <span className="ml-1 text-red-400">
            *
          </span>
        )}
      </span>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-white/10 bg-black px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/25"
      />

    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {

  return (
    <label className="block">

      <span className="mb-2 block text-xs text-white/45">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-white/10 bg-black px-3.5 py-2.5 text-sm text-white outline-none focus:border-white/25"
      >

        <option value="">
          Select {label}
        </option>

        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}

      </select>

    </label>
  );
}