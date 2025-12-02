// api.js
const API_BASE_URL = "http://localhost:4500";

// process.env.API_URL
// change if deployed

export async function apiGet(path) {
  const res = await fetch(`${API_BASE_URL}${path}`);
  console.log("raja");
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json();
}

export async function apiPost(path, body = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`POST ${path} failed`);
  return res.json();
}


export async function apiPut(path, body = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`PUT ${path} failed`);
  return res.json();
}


export async function apiDelete(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error(`DELETE ${path} failed`);

  try {
    return await res.json(); // in case backend returns JSON
  } catch {
    return { success: true };
  }
}

