import { toast } from 'react-toastify';

const API_BASE_URL = process.env.API_URL || "https://speak-task.onrender.com"
//  "http://localhost:4500";

export async function apiGet(path) {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json();
}

export async function apiPost(path, body = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let json = null;
  try {
    json = await res.json();
  } catch {
    json = {};
  }

  if (res.ok) {
    toast.success(json.message || "Success!");
    return json;
  }

  toast.error(json.message || "Something went wrong!");
  throw new Error(json.message || "POST request failed");
}

export async function apiPostFormData(path, formData) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    body: formData, 
  });

  if (!res.ok)  throw new Error( "FormData POST failed");

   return res;
}


export async function apiPut(path, body = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

   if(res.ok){
       toast.success("Task updated successfully!");   
   }
  else {
      toast.error("Failed to update task.", res.error);
      throw new Error(`PUT ${path} failed`);
  }
    
   
  return res.json();
}


export async function apiDelete(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
  });

  if (res.ok){
     toast.success("Task deleted successfully!");   
  }
    else {
       toast.error("Failed to delete task.", res.error);
      throw new Error(`DELETE ${path} failed`);
    }
  

  try {
    return await res.json();
  } catch {
    return { success: true };
  }
}

