import instance from "../../utils/service";

// GET /api/v1/dashboard/low-stock?threshold=5&limit=20
// response: [{ id, name, author, stock, soldCount }]
export async function getLowStock({ threshold = 5, limit = 20 } = {}) {
  try {
    const res = await instance.get("/api/v1/dashboard/low-stock", {
      params: { threshold, limit },
    });
    return { success: true, data: res.data };
  } catch (err) {
    const errData = err?.response?.data;
    return {
      success: false,
      message: errData?.message || errData?.error || errData?.detail || err?.message || "Error fetching low stock",
    };
  }
}
// response: [{ categoryId, categoryName, titles, stock, unitsSold, revenue }]
export async function getCategoryPerformance() {
  try {
    const res = await instance.get("/api/v1/dashboard/categories");
    return { success: true, data: res.data };
  } catch (err) {
    const errData = err?.response?.data;
    return {
      success: false,
      message: errData?.message || errData?.error || errData?.detail || err?.message || "Error fetching category performance",
    };
  }
}

// GET /api/v1/dashboard/sales-trend?days=30
// response: [{ date, sales, units, revenue }]
export async function getSalesTrend(days = 30) {
  try {
    const res = await instance.get("/api/v1/dashboard/sales-trend", {
      params: { days },
    });
    return { success: true, data: res.data };
  } catch (err) {
    const errData = err?.response?.data;
    return {
      success: false,
      message: errData?.message || errData?.error || errData?.detail || err?.message || "Error fetching sales trend",
    };
  }
}
