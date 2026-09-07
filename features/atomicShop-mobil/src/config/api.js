import { Platform } from "react-native";

const RAW_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://api-atomicshop.onrender.com";

export function getBaseUrl() {
  if (Platform.OS === "android") {
    return RAW_BASE.replace("localhost", "10.0.2.2");
  }
  return RAW_BASE;
}

export async function apiFetch(path, options = {}) {
  const url = `${getBaseUrl()}${path}`;
  return fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
}
