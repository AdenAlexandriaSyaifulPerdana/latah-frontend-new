import type { Report } from "../types/report";

function isBrowser() {
  return typeof window !== "undefined";
}

function getIdsStorageKey(userId: number | string) {
  return `latah_my_report_ids_${userId}`;
}

function getReportsStorageKey(userId: number | string) {
  return `latah_my_reports_${userId}`;
}

export function getStoredMyReportIds(userId?: number | string | null) {
  if (!isBrowser() || !userId) return [];

  const rawValue = window.localStorage.getItem(getIdsStorageKey(userId));

  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => Number(item))
      .filter((item) => Number.isFinite(item));
  } catch {
    return [];
  }
}

export function getStoredMyReports(userId?: number | string | null): Report[] {
  if (!isBrowser() || !userId) return [];

  const rawValue = window.localStorage.getItem(getReportsStorageKey(userId));

  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) return [];

    return parsed as Report[];
  } catch {
    return [];
  }
}

export function saveStoredMyReportId(
  userId?: number | string | null,
  reportId?: number | string | null,
) {
  if (!isBrowser() || !userId || !reportId) return;

  const numericReportId = Number(reportId);

  if (!Number.isFinite(numericReportId)) return;

  const currentIds = getStoredMyReportIds(userId);
  const nextIds = Array.from(new Set([numericReportId, ...currentIds]));

  window.localStorage.setItem(getIdsStorageKey(userId), JSON.stringify(nextIds));
}

export function saveStoredMyReport(
  userId?: number | string | null,
  report?: Report | null,
) {
  if (!isBrowser() || !userId || !report) return;

  if (report.id) {
    saveStoredMyReportId(userId, report.id);
  }

  const currentReports = getStoredMyReports(userId);

  const nextReports = [
    report,
    ...currentReports.filter((item) => Number(item.id) !== Number(report.id)),
  ];

  window.localStorage.setItem(
    getReportsStorageKey(userId),
    JSON.stringify(nextReports),
  );
}