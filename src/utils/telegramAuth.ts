export const TELEGRAM_BOT_USERNAME = "kach_motivach_bot";
export const KACH_API_URL = "https://kach.brostep.click";
export const TELEGRAM_USER_STORAGE_KEY = "kach_telegram_user";
export const TELEGRAM_AUTH_MAX_AGE_SEC = 7 * 24 * 60 * 60;
export const TELEGRAM_AUTH_CHANGED_EVENT = "kach-telegram-auth";

export type TelegramAuthUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

function notifyAuthChanged() {
  window.dispatchEvent(new Event(TELEGRAM_AUTH_CHANGED_EVENT));
}

export function isTelegramAuthUser(value: unknown): value is TelegramAuthUser {
  if (!value || typeof value !== "object") {
    return false;
  }
  const user = value as TelegramAuthUser;
  return (
    typeof user.id === "number" &&
    typeof user.first_name === "string" &&
    typeof user.auth_date === "number" &&
    typeof user.hash === "string" &&
    user.hash.length > 0
  );
}

export function isSessionValid(user: TelegramAuthUser): boolean {
  const ageSec = Math.floor(Date.now() / 1000) - Number(user.auth_date);
  return Number.isFinite(ageSec) && ageSec <= TELEGRAM_AUTH_MAX_AGE_SEC;
}

export function getTelegramUser(): TelegramAuthUser | null {
  const raw = window.localStorage.getItem(TELEGRAM_USER_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isTelegramAuthUser(parsed)) {
      return null;
    }
    if (!isSessionValid(parsed)) {
      clearTelegramUser();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setTelegramUser(user: TelegramAuthUser) {
  window.localStorage.setItem(TELEGRAM_USER_STORAGE_KEY, JSON.stringify(user));
  notifyAuthChanged();
}

export function clearTelegramUser() {
  window.localStorage.removeItem(TELEGRAM_USER_STORAGE_KEY);
  notifyAuthChanged();
}

export function formatTelegramDisplayName(user: TelegramAuthUser): string {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return user.username ? `${name} (@${user.username})` : name;
}
