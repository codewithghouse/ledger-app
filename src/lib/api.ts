import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("acc_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  login: (data: { company_id: string; email: string; password: string }) =>
    api.post("/auth/login", data),
  firebaseLogin: (idToken: string) => api.post("/auth/firebase-login", { id_token: idToken }),
  updateProfile: (data: { company_id: string; name: string }) => api.put("/auth/profile", data),
  getCompanies: () => api.get("/auth/companies"),
};

export const productsApi = {
  list: (params?: { search?: string; category?: string }) =>
    api.get("/products/", { params }),
  getOne: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post("/products/create", data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  updateStock: (id: string, stock: number) =>
    api.patch(`/products/${id}/stock`, { stock }),
  summary: () => api.get("/products/stats/summary"),
};

export const salesApi = {
  list: (params?: { search?: string }) => api.get("/sales/", { params }),
  create: (data: any) => api.post("/sales/create", data),
  summary: () => api.get("/sales/stats/summary"),
};

export const customersApi = {
  list: (params?: { search?: string }) => api.get("/customers/", { params }),
  create: (data: any) => api.post("/customers/create", data),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
  summary: () => api.get("/customers/stats/summary"),
};

export const vendorsApi = {
  list: (params?: { search?: string }) => api.get("/vendors/", { params }),
  create: (data: any) => api.post("/vendors/create", data),
  update: (id: string, data: any) => api.put(`/vendors/${id}`, data),
  delete: (id: string) => api.delete(`/vendors/${id}`),
  summary: () => api.get("/vendors/stats/summary"),
};

export const purchasesApi = {
  list: (params?: { search?: string }) => api.get("/purchases/", { params }),
  create: (data: any) => api.post("/purchases/create", data),
  summary: () => api.get("/purchases/stats/summary"),
};

export const reportsApi = {
  dayBook: (date?: string) => api.get("/reports/day-book", { params: { date } }),
  ledger: (accountId: string) => api.get(`/reports/ledger/${accountId}`),
  financials: () => api.get("/reports/financials"),
  receivables: () => api.get("/reports/bills/receivable"),
  payables: () => api.get("/reports/bills/payable"),
  cashBook: () => api.get("/reports/cash-book"),
  bankBook: () => api.get("/reports/bank-book"),
};

export const returnsApi = {
  create: (data: any) => api.post("/returns", data),
  list: (type: string) => api.get("/returns", { params: { type } }),
};

export const ordersApi = {
  create: (data: any) => api.post("/orders", data),
  list: (type: string) => api.get("/orders", { params: { type } }),
};

export const deliveryApi = {
  create: (data: any) => api.post("/delivery", data),
  list: () => api.get("/delivery"),
};

export const journalsApi = {
  create: (data: any) => api.post("/journals", data),
  list: () => api.get("/journals"),
};

export const bulkApi = {
  upload: (file: File, type: string) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`/bulk/upload?type=${type}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export const dashboardApi = {
  getStats: () => api.get("/dashboard/stats"),
};

export default api;
