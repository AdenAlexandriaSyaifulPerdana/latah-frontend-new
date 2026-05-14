import { STORAGE_KEYS } from "./constants";
import type { AuthSession } from "../types/auth";
import type { User } from "../types/user";

function isBrowser() {
  return typeof window !== "undefined";
}

export const authStorage = {
  getToken() {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(STORAGE_KEYS.token);
  },

  getUser(): User | null {
    if (!isBrowser()) return null;

    const rawUser = window.localStorage.getItem(STORAGE_KEYS.user);

    if (!rawUser) return null;

    try {
      return JSON.parse(rawUser) as User;
    } catch {
      this.clear();
      return null;
    }
  },

  getSession(): AuthSession | null {
    const token = this.getToken();
    const user = this.getUser();

    if (!token || !user) return null;

    return {
      token,
      user,
    };
  },

  setSession(session: AuthSession) {
    if (!isBrowser()) return;

    window.localStorage.setItem(STORAGE_KEYS.token, session.token);
    window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(session.user));
  },

  clear() {
    if (!isBrowser()) return;

    window.localStorage.removeItem(STORAGE_KEYS.token);
    window.localStorage.removeItem(STORAGE_KEYS.user);
  },
};