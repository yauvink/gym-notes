export const TELEGRAM_BOT_USERNAME = "kach_motivach_bot";
export const KACH_API_URL = "https://kach.brostep.click";
export const TELEGRAM_USER_STORAGE_KEY = "kach_telegram_user";
export const TELEGRAM_AUTH_MAX_AGE_SEC = 7 * 24 * 60 * 60;
export const TELEGRAM_AUTH_CHANGED_EVENT = "kach-telegram-auth";
const TELEGRAM_LOG_STYLE = "color: #FF2BD6; font-weight: 800;";

export function logTelegram(message: string, extra?: unknown) {
  if (extra !== undefined) {
    console.log(`%c[Telegram] ${message}`, TELEGRAM_LOG_STYLE, extra);
    return;
  }
  console.log(`%c[Telegram] ${message}`, TELEGRAM_LOG_STYLE);
}

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

export function parseTelegramAuthUser(value: unknown): TelegramAuthUser | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const raw = value as Record<string, unknown>;
  const id = Number(raw.id);
  const authDate = Number(raw.auth_date);
  if (!Number.isInteger(id) || id <= 0 || !Number.isFinite(authDate)) {
    return null;
  }
  if (typeof raw.first_name !== "string" || raw.first_name.length === 0) {
    return null;
  }
  if (typeof raw.hash !== "string" || raw.hash.length === 0) {
    return null;
  }

  const user: TelegramAuthUser = {
    id,
    first_name: raw.first_name,
    auth_date: authDate,
    hash: raw.hash,
  };
  if (typeof raw.last_name === "string" && raw.last_name) {
    user.last_name = raw.last_name;
  }
  if (typeof raw.username === "string" && raw.username) {
    user.username = raw.username;
  }
  if (typeof raw.photo_url === "string" && raw.photo_url) {
    user.photo_url = raw.photo_url;
  }
  return user;
}

export function isTelegramAuthUser(value: unknown): value is TelegramAuthUser {
  return parseTelegramAuthUser(value) !== null;
}

type TelegramAuthListener = (user: TelegramAuthUser) => void;
let telegramAuthListener: TelegramAuthListener | null = null;

export function setTelegramAuthListener(listener: TelegramAuthListener | null) {
  telegramAuthListener = listener;
}

export function installTelegramAuthBridge() {
  window.onTelegramAuth = (user: unknown) => {
    logTelegram("auth callback", user);
    const parsed = parseTelegramAuthUser(user);
    if (!parsed) {
      console.warn("%c[Telegram] rejected payload", TELEGRAM_LOG_STYLE, user);
      return;
    }
    if (!telegramAuthListener) {
      console.warn("%c[Telegram] callback fired but no listener", TELEGRAM_LOG_STYLE);
      return;
    }
    telegramAuthListener(parsed);
  };
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
    const parsed = parseTelegramAuthUser(JSON.parse(raw));
    if (!parsed) {
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
