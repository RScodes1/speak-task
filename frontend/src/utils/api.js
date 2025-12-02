// api.js
const API_BASE_URL = "http://localhost:4500";

// process.env.API_URL
// change if deployed

export async function apiGet(path) {
  const res = await fetch(`${API_BASE_URL}${path}`);
  console.log({res});
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json();
}

export async function apiPost(path, body = {}) {
  const isFormData = body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: isFormData
      ? {} // let browser set Content-Type and boundary automatically
      : { "Content-Type": "application/json" },
    body: isFormData ? body : JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`POST ${path} failed`);

  // Only parse JSON if it's not FormData response
  return isFormData ? res : res.json();
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

