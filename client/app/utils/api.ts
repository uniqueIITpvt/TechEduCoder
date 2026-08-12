const configuredApiBaseUrl = process.env.NEXT_PUBLIC_SERVER_URI?.trim();

if (!configuredApiBaseUrl && process.env.NODE_ENV === "production") {
  throw new Error("NEXT_PUBLIC_SERVER_URI is required in production");
}

export const API_BASE_URL = (configuredApiBaseUrl || "/api/v1").replace(
  /\/+$/,
  ""
);

export const apiUrl = (path: string) => {
  const normalizedPath = path.replace(/^\/+/, "");

  return `${API_BASE_URL}/${normalizedPath}`;
};
