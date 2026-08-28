import { IUser, IArticle, ICategory, IBanner, IProgram, IExtracurricular, IFacility, IAchievement, IGalleryActivity, IFAQ } from './types';

const API_BASE = 'http://localhost:1337/api';
export const UPLOAD_BASE = 'http://localhost:1337';

export const getToken = (): string | null => localStorage.getItem('nurtech_admin_token');
export const setToken = (token: string) => localStorage.setItem('nurtech_admin_token', token);
export const removeToken = () => localStorage.removeItem('nurtech_admin_token');

export const getUser = (): IUser | null => {
  try {
    return JSON.parse(localStorage.getItem('nurtech_admin_user') || 'null');
  } catch (e) {
    return null;
  }
};
export const setUser = (user: IUser) => {
  localStorage.setItem('nurtech_admin_user', JSON.stringify(user));
  window.dispatchEvent(new Event('admin_user_changed'));
};
export const removeUser = () => localStorage.removeItem('nurtech_admin_user');

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {})
  };

  const config: RequestInit = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data?.error?.message || data?.message || 'Terjadi kesalahan saat memproses permintaan.';
      throw new Error(errorMsg);
    }

    return data;
  } catch (err: any) {
    console.error(`API Error on ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  login: (email: string, password: string) => request<{ jwt: string; user: IUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  register: (name: string, email: string, password: string) => request<{ jwt: string; user: IUser }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  }),
  getMe: () => request<IUser>('/auth/me'),

  // Stats & Analytics
  getStats: () => request<{ counts: Record<string, number>; recentArticles: IArticle[] }>('/dashboard/stats'),
  getAnalyticsSummary: (period = '7d') => request<{
    period: string;
    totals: {
      allTime: { pageViews: number; registerClicks: number; downloadClicks: number; whatsappClicks: number; appClicks: number };
      period: { pageViews: number; registerClicks: number; downloadClicks: number; whatsappClicks: number };
    };
    dailyTrend: Array<{ date: string; label: string; pageViews: number; registerClicks: number; downloadClicks: number; whatsappClicks: number }>;
    recentActivities: Array<{ id: number; eventType: string; pagePath: string; ipAddress: string; metadata: any; createdAt: string }>;
  }>(`/analytics/summary?period=${period}`),


  // Articles & Categories
  getArticles: (params = '') => request<{ data: IArticle[] }>(`/articles${params}`),
  getArticle: (slugOrId: string | number) => request<{ data: IArticle }>(`/articles/${slugOrId}`),
  createArticle: (data: any) => request('/articles', { method: 'POST', body: JSON.stringify(data) }),
  updateArticle: (id: number, data: any) => request(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteArticle: (id: number) => request(`/articles/${id}`, { method: 'DELETE' }),

  getCategories: () => request<{ data: ICategory[] }>('/categories'),
  createCategory: (data: any) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: number, data: any) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: number) => request(`/categories/${id}`, { method: 'DELETE' }),

  // Banners
  getBanners: () => request<{ data: IBanner[] }>('/banners'),
  createBanner: (data: any) => request('/banners', { method: 'POST', body: JSON.stringify(data) }),
  updateBanner: (id: number, data: any) => request(`/banners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBanner: (id: number) => request(`/banners/${id}`, { method: 'DELETE' }),

  // Programs & Extracurriculars
  getPrograms: () => request<{ data: IProgram[] }>('/featured-programs'),
  createProgram: (data: any) => request('/featured-programs', { method: 'POST', body: JSON.stringify(data) }),
  updateProgram: (id: number, data: any) => request(`/featured-programs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProgram: (id: number) => request(`/featured-programs/${id}`, { method: 'DELETE' }),

  getExtracurriculars: () => request<{ data: IExtracurricular[] }>('/extracurricular-activities'),
  createExtracurricular: (data: any) => request('/extracurricular-activities', { method: 'POST', body: JSON.stringify(data) }),
  updateExtracurricular: (id: number, data: any) => request(`/extracurricular-activities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExtracurricular: (id: number) => request(`/extracurricular-activities/${id}`, { method: 'DELETE' }),

  // Achievements & Facilities
  getAchievements: () => request<{ data: IAchievement[] }>('/achievements'),
  createAchievement: (data: any) => request('/achievements', { method: 'POST', body: JSON.stringify(data) }),
  updateAchievement: (id: number, data: any) => request(`/achievements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAchievement: (id: number) => request(`/achievements/${id}`, { method: 'DELETE' }),

  getFacilities: () => request<{ data: IFacility[] }>('/facilities'),
  createFacility: (data: any) => request('/facilities', { method: 'POST', body: JSON.stringify(data) }),
  updateFacility: (id: number, data: any) => request(`/facilities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFacility: (id: number) => request(`/facilities/${id}`, { method: 'DELETE' }),

  // Gallery
  getGalleries: () => request<{ data: IGalleryActivity[] }>('/gallery-activities'),
  getGallery: (id: string | number) => request<{ data: IGalleryActivity }>(`/gallery-activities/${id}`),
  createGallery: (data: any) => request('/gallery-activities', { method: 'POST', body: JSON.stringify(data) }),
  updateGallery: (id: number, data: any) => request(`/gallery-activities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGallery: (id: number) => request(`/gallery-activities/${id}`, { method: 'DELETE' }),

  // FAQs
  getFAQs: () => request<{ data: IFAQ[] }>('/faqs'),
  createFAQ: (data: any) => request('/faqs', { method: 'POST', body: JSON.stringify(data) }),
  updateFAQ: (id: number, data: any) => request(`/faqs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFAQ: (id: number) => request(`/faqs/${id}`, { method: 'DELETE' }),

  // Activity Schedules
  getSchedules: () => request<{ data: any[] }>('/activity-schedules'),
  createSchedule: (data: any) => request('/activity-schedules', { method: 'POST', body: JSON.stringify(data) }),
  updateSchedule: (id: number, data: any) => request(`/activity-schedules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSchedule: (id: number) => request(`/activity-schedules/${id}`, { method: 'DELETE' }),

  // Single Types & Settings
  getProfile: () => request('/profile'),
  updateProfile: (data: any) => request('/profile', { method: 'PUT', body: JSON.stringify(data) }),

  getAbout: () => request('/about'),
  updateAbout: (data: any) => request('/about', { method: 'PUT', body: JSON.stringify(data) }),

  getVisionMission: () => request('/vision-mission'),
  updateVisionMission: (data: any) => request('/vision-mission', { method: 'PUT', body: JSON.stringify(data) }),

  getRegistrationRequirements: () => request('/registration-requirements'),
  createRegistrationRequirement: (data: any) => request('/registration-requirements', { method: 'POST', body: JSON.stringify(data) }),
  updateRegistrationRequirement: (id: number, data: any) => request(`/registration-requirements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRegistrationRequirement: (id: number) => request(`/registration-requirements/${id}`, { method: 'DELETE' }),

  getRegistrationCost: () => request('/registration-cost'),
  updateRegistrationCost: (data: any) => request('/registration-cost', { method: 'PUT', body: JSON.stringify(data) }),

  getContact: () => request('/contact-us'),
  updateContact: (data: any) => request('/contact-us', { method: 'PUT', body: JSON.stringify(data) }),

  getGlobal: () => request('/global'),
  updateGlobal: (data: any) => request('/global', { method: 'PUT', body: JSON.stringify(data) }),

  changePassword: (data: any) => request('/auth/change-password', { method: 'PUT', body: JSON.stringify(data) }),
  updateMe: (data: any) => request('/auth/me', { method: 'PUT', body: JSON.stringify(data) }),

  getAppSection: () => request('/app-sections'),
  updateAppSection: (data: any) => request('/app-sections', { method: 'PUT', body: JSON.stringify(data) }),

  getFooters: () => request('/footers'),
  createFooter: (data: any) => request('/footers', { method: 'POST', body: JSON.stringify(data) }),
  updateFooter: (id: number, data: any) => request(`/footers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFooter: (id: number) => request(`/footers/${id}`, { method: 'DELETE' }),

  getFooterSubMenus: () => request('/footer-sub-menus'),
  createFooterSubMenu: (data: any) => request('/footer-sub-menus', { method: 'POST', body: JSON.stringify(data) }),
  updateFooterSubMenu: (id: number, data: any) => request(`/footer-sub-menus/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFooterSubMenu: (id: number) => request(`/footer-sub-menus/${id}`, { method: 'DELETE' }),

  // Upload file
  uploadFile: async (file: File): Promise<string | null> => {
    const token = getToken();
    const formData = new FormData();
    formData.append('files', file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || 'Gagal mengunggah file.');
    return data[0]?.url || null;
  },

  uploadMultipleFiles: async (files: FileList | File[]): Promise<string[]> => {
    const token = getToken();
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append('files', f));

    const res = await fetch(`${API_BASE}/upload/multiple`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || 'Gagal mengunggah file.');
    return (Array.isArray(data) ? data : []).map((d: any) => d?.url).filter(Boolean);
  }
};
