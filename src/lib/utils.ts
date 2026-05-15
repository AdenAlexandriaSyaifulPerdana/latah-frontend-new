import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value?: string | Date | null) {
  if (!value) return "-";

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function parseApiDate(date: string | Date) {
  if (date instanceof Date) {
    return date;
  }

  const hasTimezone =
    date.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(date);

  return new Date(hasTimezone ? date : `${date}Z`);
}

export function formatDateTime(date?: string | Date | null) {
  if (!date) return "-";

  const value = parseApiDate(date);

  if (Number.isNaN(value.getTime())) {
    return "-";
  }

  return `${new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(value)} WIB`;
}

export function toNumber(value: unknown, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

export function getInitials(name?: string | null) {
  if (!name) return "U";

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function truncateText(text: string, maxLength = 120) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}