const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ==================== TOKEN MANAGEMENT ====================

export const getToken = (): string | null => localStorage.getItem('token');
export const setToken = (token: string) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

export const getUser = () => {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};
export const setUser = (user: any) => localStorage.setItem('user', JSON.stringify(user));
export const removeUser = () => localStorage.removeItem('user');

export const isAuthenticated = (): boolean => !!getToken();

export const logout = () => {
  removeToken();
  removeUser();
  window.location.href = '/';
};

// ==================== CASE CONVERSION ====================
// Backend returns camelCase, frontend (from Supabase era) expects snake_case

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function convertKeysToSnake(obj: any): any {
  if (Array.isArray(obj)) return obj.map(convertKeysToSnake);
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.keys(obj).reduce((acc: any, key) => {
      acc[camelToSnake(key)] = convertKeysToSnake(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

// ==================== HTTP HELPERS ====================

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = token;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 || res.status === 403) {
    logout();
    throw new Error('Session expired');
  }

  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, ...data };
  }

  return data;
}

function get<T = any>(path: string) {
  return request<T>(path, { method: 'GET' });
}

function post<T = any>(path: string, body?: any) {
  return request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
}

function patch<T = any>(path: string, body?: any) {
  return request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined });
}

function put<T = any>(path: string, body?: any) {
  return request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined });
}

function del<T = any>(path: string) {
  return request<T>(path, { method: 'DELETE' });
}

// ==================== AUTH ====================

export const api = {
  auth: {
    register: (data: any) => post('/conversia/auth/register', data),
    login: async (email: string, password: string) => {
      const res = await post<{ token: string; user: any }>('/conversia/auth/login', { email, password });
      setToken(res.token);
      setUser(res.user);
      return res;
    },
    logout,
    getSession: () => {
      const token = getToken();
      const user = getUser();
      return { token, user };
    },
    isAuthenticated,
    resetPassword: (email: string) => post('/login/forgot-password', { email }),
    updatePassword: (userId: number, hash: string, password: string) =>
      patch('/users/pass-login', { id: userId, hash, password }),
  },

  // ==================== PROFILE ====================
  profile: {
    get: () => get('/conversia/profile'),
    update: (data: any) => patch('/conversia/profile', data),
  },

  // ==================== COMPANY ====================
  company: {
    setNextPlan: (idPlan: number) => patch('/conversia/company/next-plan', { idPlan }),
  },

  // ==================== SUBSCRIPTIONS ====================
  subscriptions: {
    list: async () => convertKeysToSnake(await get('/conversia/subscriptions')),
    create: (data: any) => post('/conversia/subscriptions', data),
  },

  // ==================== TRANSACTIONS ====================
  transactions: {
    list: async () => convertKeysToSnake(await get('/conversia/transactions')),
    success: (data: any) => post('/companies/transaction-success', data),
    createPending: (data: any) => post('/conversia/transactions/pending', data),
    update: (data: any) => patch('/conversia/transactions/update', data),
  },

  // ==================== SUPPORT TICKETS ====================
  tickets: {
    list: async () => convertKeysToSnake(await get('/conversia/tickets')),
    create: (data: any) => post('/conversia/tickets', data),
    messages: async (idTicket: number) => convertKeysToSnake(await get(`/conversia/tickets/${idTicket}/messages`)),
    sendMessage: (data: any) => post('/conversia/tickets/messages', data),
    updateStatus: (data: any) => patch('/conversia/tickets/status', data),
  },

  // ==================== SELLER COMMISSIONS ====================
  commissions: {
    list: async () => convertKeysToSnake(await get('/conversia/commissions')),
    create: (data: any) => post('/conversia/commissions', data),
    updateStatus: (data: any) => patch('/conversia/commissions/status', data),
  },

  // ==================== TRM ====================
  trm: {
    latest: () => get('/conversia/auth/trm'),
    create: (data: any) => post('/conversia/trm', data),
  },

  // ==================== PAYPAL PLANS ====================
  plans: {
    list: () => get('/conversia/auth/plans'),
  },

  // ==================== SSO ====================
  sso: {
    generateCode: () => post('/conversia/sso-code', {}),
  },

  // ==================== ROLES CONVERSIA ====================
  roles: {
    list: () => get('/conversia/roles'),
    assign: (idUser: number, idRoleConversia: number) =>
      post('/conversia/roles/assign', { idUser, idRoleConversia }),
  },

  // ==================== ADMIN ====================
  admin: {
    // Profiles
    profiles: async () => convertKeysToSnake(await get('/conversia/admin/profiles')),
    updateProfile: (profileId: string, data: any) => patch(`/conversia/admin/profiles/${profileId}`, data),
    updateProfileSeller: (userId: string, data: any) => patch(`/conversia/admin/profiles/${userId}/seller`, data),
    updateStartDate: (profileId: string, data: any) => patch(`/conversia/admin/profiles/${profileId}/start-date`, data),
    // Roles
    roles: () => get('/conversia/admin/roles'),
    updateRole: (data: any) => put('/conversia/admin/roles', data),
    // Transactions (admin view - all)
    transactions: async () => convertKeysToSnake(await get('/conversia/admin/transactions')),
    createTransaction: (data: any) => post('/conversia/admin/transactions', data),
    updateTransaction: (reference: string, data: any) => patch(`/conversia/admin/transactions/${encodeURIComponent(reference)}`, data),
    // Tickets (admin view - all)
    tickets: async () => convertKeysToSnake(await get('/conversia/admin/tickets')),
    ticketMessages: async (ticketId: string) => convertKeysToSnake(await get(`/conversia/admin/tickets/${ticketId}/messages`)),
    sendTicketMessage: (data: any) => post('/conversia/admin/tickets/messages', data),
    updateTicketStatus: (ticketId: string, data: any) => patch(`/conversia/admin/tickets/${ticketId}/status`, data),
    // Commissions (admin view - all)
    commissions: async () => convertKeysToSnake(await get('/conversia/admin/commissions')),
    createCommission: (data: any) => post('/conversia/admin/commissions', data),
    cancelCommission: (id: string, data: any) => patch(`/conversia/admin/commissions/${id}/cancel`, data),
    payCommissions: (data: any) => post('/conversia/admin/commissions/pay', data),
  },

  // ==================== COUPONS ====================
  coupons: {
    // Admin
    list: async () => convertKeysToSnake(await get('/coupons')),
    getById: async (id: number) => convertKeysToSnake(await get(`/coupons/${id}`)),
    create: (data: { idUserOwner: number; discountType?: 'fixed' | 'percent'; discountValue: number; discountCurrency: 'COP' | 'USD'; expiresAt?: string | null; maxUses?: number | null }) =>
      post('/coupons', data),
    update: (id: number, data: any) => patch(`/coupons/${id}`, data),
    remove: (id: number) => del(`/coupons/${id}`),
    // Owner
    mine: async () => convertKeysToSnake(await get('/coupons/mine/list')),
    mineUsages: async (id: number) => convertKeysToSnake(await get(`/coupons/mine/${id}/usages`)),
    // Validate (authenticated)
    validate: (code: string, planPriceAmount: number, planPriceCurrency: 'COP' | 'USD') =>
      post('/coupons/validate', { code, planPriceAmount, planPriceCurrency }),
    // Validate (guest checkout via document)
    validatePublic: (document: string, code: string, planPriceAmount: number, planPriceCurrency: 'COP' | 'USD') =>
      post('/coupons/validate-public', { document, code, planPriceAmount, planPriceCurrency }),
  },

  // ==================== PAYMENT FUNCTIONS (migrated from Supabase Edge Functions) ====================
  payments: {
    wompiSignature: (data: any) => post('/conversia/payments/wompi-signature', data),
    paypalCreateSubscription: (data: any) => post('/conversia/payments/paypal-create-subscription', data),
    paypalActivateSubscription: (data: any) => post('/conversia/payments/paypal-activate-subscription', data),
    tokenizeCard: (data: any) => post('/conversia/payments/tokenize-card', data),
    calculateCommissions: () => post('/conversia/payments/calculate-commissions'),
    processRecurringPayments: () => post('/conversia/payments/process-recurring-payments'),
    renewalPayment: (data: any) => post('/conversia/payments/renewal-payment', data),
    searchByDocument: (data: any) => post('/conversia/payments/search-by-document', data),
    siigoGetInvoicePdf: (data: any) => post('/conversia/payments/siigo-invoice-pdf', data),
    validateInvoiceData: () => post('/conversia/payments/validate-invoice-data', {}),
    redeemFreeCoupon: (data: any) => post('/conversia/payments/redeem-free-coupon', data),
    redeemFreeCouponPublic: (data: any) => post('/conversia/payments/redeem-free-coupon-public', data),
  },
};
