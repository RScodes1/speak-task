
const API_BASE_URL = process.env.API_URL || "https://speak-task.onrender.com"

export async function apiGet(path) {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json();
}

export async function apiPost(path, body = {}) {
  const isFormData = body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: isFormData
      ? {} 
      : { "Content-Type": "application/json" },
    body: isFormData ? body : JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`POST ${path} failed`);

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
    return await res.json();
  } catch {
    return { success: true };
  }
}

