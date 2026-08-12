const configuredApiBaseUrl = process.env.NEXT_PUBLIC_SERVER_URI?.trim();
const productionApiBaseUrl = "https://techeducoderlmsbackend.vercel.app/api/v1/";

const withApiPrefix = (baseUrl: string) => {
  const trimmedBaseUrl = baseUrl.replace(/\/+$/, "");

  if (trimmedBaseUrl.endsWith("/api/v1")) {
    return trimmedBaseUrl;
  }

  try {
    const url = new URL(trimmedBaseUrl);

    if (url.hostname === "techeducoderlmsbackend.vercel.app") {
      url.pathname = `${url.pathname.replace(/\/+$/, "")}/api/v1`;
      return url.toString().replace(/\/+$/, "");
    }
  } catch {
    // Relative URLs such as /api/v1 are valid in local rewrites.
  }

  return trimmedBaseUrl;
};

export const API_BASE_URL = withApiPrefix(
  configuredApiBaseUrl ||
    (process.env.NODE_ENV === "production" ? productionApiBaseUrl : "/api/v1")
);

export const apiUrl = (path: string) => {
  const normalizedPath = path.replace(/^\/+/, "");

  return `${API_BASE_URL}/${normalizedPath}`;
};
