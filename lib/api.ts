const fallbackApiBaseUrl =
  process.env.NODE_ENV === "production" ? "/_/backend" : "http://localhost:5000";

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || fallbackApiBaseUrl;
