import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ApiUser } from "./api";

const TOKEN_KEY = "reprise.auth.token";
const USER_KEY = "reprise.auth.user";

export type StoredSession = {
  token: string;
  user: ApiUser;
};

let sessionToken: string | null = null;

export async function persistSession(
  session: StoredSession,
  persist: boolean,
): Promise<void> {
  sessionToken = session.token;

  if (!persist) {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]).catch(() => undefined);
    return;
  }

  await AsyncStorage.multiSet([
    [TOKEN_KEY, session.token],
    [USER_KEY, JSON.stringify(session.user)],
  ]).catch(() => undefined);
}

export async function loadPersistedSession(): Promise<StoredSession | null> {
  try {
    const entries = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
    const token = entries[0]?.[1];
    const rawUser = entries[1]?.[1];

    if (!token || !rawUser) {
      return null;
    }

    const user = JSON.parse(rawUser) as ApiUser;
    sessionToken = token;
    return { token, user };
  } catch {
    return null;
  }
}

export async function clearPersistedSession(): Promise<void> {
  sessionToken = null;
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]).catch(() => undefined);
}

export function getSessionToken(): string | null {
  return sessionToken;
}
