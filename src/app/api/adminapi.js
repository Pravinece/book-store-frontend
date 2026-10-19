import toast from "../../components/Toast";
import instance from "../../utils/service";

const BASE = "/api/v1";

// ── UPLOADS ──────────────────────────────────────────────────────────────────
export async function uploadImage(kind, file) {
  const form = new FormData();
  form.append("file", file);
  try {
    const res = await instance.post(`${BASE}/uploads/${kind}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { success: true, imageUrl: res.data.imageUrl };
  } catch (err) {
    return { success: false, message: err?.response?.data?.message || err.message };
  }
}

// ── CATEGORIES ───────────────────────────────────────────────────────────────
export async function getCategories() {
  try {
    const res = await instance.get(`${BASE}/categories`);
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, message: err?.response?.data?.message || err.message };
  }
}

export async function createCategory(body) {
  try {
    const res = await instance.post(`${BASE}/categories`, body);
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, message: err?.response?.data?.message || err.message };
  }
}

export async function updateCategory(id, body) {
  const { name, description, color, spineColor, textColor, accentColor, image } = body;
  try {
    const res = await instance.put(`${BASE}/categories/${id}`, { name, description, color, spineColor, textColor, accentColor, image });
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, message: err?.response?.data?.message || err.message };
  }
}

export async function deleteCategory(id) {
  try {
    await instance.delete(`${BASE}/categories/${id}`);
    return { success: true };
  } catch (err) {
    return { success: false, message: err?.response?.data?.message || err.message };
  }
}

// ── BOOKS ─────────────────────────────────────────────────────────────────────
export async function getBooks(params = {}) {
  try {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    );
    const res = await instance.get(`${BASE}/books/`, { params: cleanParams });
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, message: err?.response?.data?.message || err.message };
  }
}
export async function getAdminBooks(params = {}) {
  try {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    );
    const res = await instance.get(`${BASE}/books/manage/list`, { params: cleanParams });
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, message: err?.response?.data?.message || err.message };
  }
}

export async function getBookById(id) {
  try {
    const res = await instance.get(`${BASE}/books/${encodeURIComponent(id)}`);
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, message: err?.response?.data?.message || err.message };
  }
}

export async function createBook(body) {
  try {
    const res = await instance.post(`${BASE}/books`, body);
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, message: err?.response?.data?.message || err.message };
  }
}

export async function updateBook(id, body) {
  const { title, author, publisher, description, categoryId, isbn, price, imageUrl } = body;
  try {
    const res = await instance.put(`${BASE}/books/${id}`, { title, author, publisher, description, categoryId, isbn, price, imageUrl });
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, message: err?.response?.data?.message || err.message };
  }
}

export async function deleteBook(id) {
  try {
    await instance.delete(`${BASE}/books/${id}`);
    return { success: true };
  } catch (err) {
    return { success: false, message: err?.response?.data?.message || err.message };
  }
}

export async function patchBookStock(id, delta) {
  try {
    const res = await instance.patch(`${BASE}/books/${id}/stock`, { delta });
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, message: err?.response?.data?.message || err.message };
  }
}

export async function bulkUploadBooks(file, dryRun = false) {
  const form = new FormData();
  form.append("file", file);
  try {
    const res = await instance.post(`${BASE}/books/bulk?dryRun=${dryRun}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (dryRun) toast.success(`Dry-run successful! No changes made.`);
    else toast.success(`Successfully uploaded ${res.data.count} books!`);
    return { success: true, data: res.data };
  } catch (err) {
    if (err?.response?.data?.message) toast.error(err.response.data.message);
    return { success: false, message: err?.response?.data?.message || err.message };
  }
}

export async function exportBooksCSV() {
  try {
    const res = await instance.get(`${BASE}/books/export/csv`, { responseType: 'blob' });
    const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
    if (blob.size === 0) return { success: false, message: "No book data found!" };
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "books_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Exported books list successfully!");
    return { success: true };
  } catch (err) {
    return { success: false, message: err?.response?.data?.message || err.message };
  }
}

// ── SALES ─────────────────────────────────────────────────────────────────────
export async function createSale(body) {
  try {
    const res = await instance.post(`${BASE}/sales`, body);
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, message: err?.response?.data?.message || err.message };
  }
}

export async function getSales(params = {}) {
  try {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    );
    const res = await instance.get(`${BASE}/sales`, { params: cleanParams });
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, message: err?.response?.data?.message || err.message };
  }
}

export async function exportSalesCSV(params = {}) {
  try {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    );
    const res = await instance.get(`${BASE}/sales/export/csv`, { params: cleanParams, responseType: 'blob' });
    const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sales_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Sales exported successfully!");
    return { success: true };
  } catch (err) {
    return { success: false, message: err?.response?.data?.message || err.message };
  }
}