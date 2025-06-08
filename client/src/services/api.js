const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

export async function apiFetch(endpoint, options = {}) {
  const url = backendUrl + endpoint;
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "API request failed");
  }
  return response.json();
}
