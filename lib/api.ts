export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

interface Options {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
}

// Browser calls go through this site's own /api path, so the HTTPOnly JWT cookie travels with them
export async function api<T>(path: string, { method = "GET", body }: Options = {}): Promise<T> {
  const send = () =>
    fetch(path, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

  let res = await send();
  // The token may be missing or expired while the login session is still valid, so renew it once
  if (res.status === 401 && (await refreshToken())) res = await send();

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(data?.message ?? "Something went wrong. Please try again.", res.status);
  return data as T;
}

export async function refreshToken() {
  const res = await fetch("/api/session-token", { method: "POST" });
  return res.ok;
}

export function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}
