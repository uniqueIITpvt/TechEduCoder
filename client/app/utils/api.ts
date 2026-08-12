const configuredApiBaseUrl = process.env.NEXT_PUBLIC_SERVER_URI?.trim();
const productionApiBaseUrl = "https://techeducoderlmsbackend.vercel.app/api/v1/";

export const API_BASE_URL = (
  configuredApiBaseUrl ||
  (process.env.NODE_ENV === "production" ? productionApiBaseUrl : "/api/v1")
).replace(/\/+$/, "");

export const apiUrl = (path: string) => {
  const normalizedPath = path.replace(/^\/+/, "");

  return `${API_BASE_URL}/${normalizedPath}`;
};
