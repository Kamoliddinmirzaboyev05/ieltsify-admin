import { apiClient } from "./api";
import { getErrorMessage } from "@/types";
import type {
  AdminDashboardResponse,
  UserProfile,
  PaymentRequest,
  AdminLog,
  CoinTransaction,
  ReferralStats,
  EdgeFunctionResponse,
  RawApiResponse,
} from "@/types";

/** Loose shape of the Django /admin-dashboard/ payload (pre-mapping). */
interface DjangoDashboardRaw {
  overview?: { total_users?: number };
  subscription_statistics?: {
    total_subscriptions?: number;
    active_subscriptions?: number;
    subscriptions_by_plan?: Record<string, number>;
  };
  coin_statistics?: {
    total_coins_distributed?: number;
    total_wallet_balance?: number;
  };
  financial_statistics?: {
    total_payments?: number;
    successful_payments?: number;
    total_revenue?: number;
  };
  usage_statistics?: { active_users_today?: number };
}

// =====================================================
// DASHBOARD - Django admin-dashboard endpoint
// =====================================================
export const adminDashboardApi = {
  getStats: async (): Promise<
    EdgeFunctionResponse<AdminDashboardResponse["data"]>
  > => {
    try {
      const data = await apiClient.get<RawApiResponse<DjangoDashboardRaw>>(
        "/admin-dashboard/",
      );
      if (data.success) {
        // Map Django response to admin panel format
        const d = data.data;
        const mappedData = {
          overview: {
            total_users: d.overview?.total_users || 0,
            active_subscriptions:
              d.subscription_statistics?.active_subscriptions || 0,
            total_coins_distributed:
              d.coin_statistics?.total_coins_distributed || 0,
            total_coins_in_circulation:
              d.coin_statistics?.total_wallet_balance || 0,
            pending_payments:
              (d.financial_statistics?.total_payments || 0) -
              (d.financial_statistics?.successful_payments || 0),
            today_active_users: d.usage_statistics?.active_users_today || 0,
          },
          subscriptions: {
            total: d.subscription_statistics?.total_subscriptions || 0,
            active: d.subscription_statistics?.active_subscriptions || 0,
            plan_distribution:
              d.subscription_statistics?.subscriptions_by_plan || {},
          },
          payments: {
            total_approved_amount: d.financial_statistics?.total_revenue || 0,
            total_pending_amount: 0,
            pending_count: 0,
          },
        };
        return { success: true, data: mappedData };
      }
      return {
        success: false,
        data: {} as AdminDashboardResponse["data"],
        error: data.error,
      };
    } catch (err) {
      return {
        success: false,
        data: {} as AdminDashboardResponse["data"],
        error: getErrorMessage(err),
      };
    }
  },
};

// =====================================================
// USERS - Django admin panel endpoints
// =====================================================
export const adminUsersApi = {
  list: async (params?: {
    search?: string;
    role?: string;
    page?: number;
    limit?: number;
  }): Promise<EdgeFunctionResponse<UserProfile[]>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.set("search", params.search);
      if (params?.role) queryParams.set("role", params.role);
      if (params?.page) queryParams.set("page", params.page.toString());
      if (params?.limit) queryParams.set("limit", params.limit.toString());

      const query = queryParams.toString();
      const url = `/admin-dashboard/users/${query ? "?" + query : ""}`;
      const data = await apiClient.get<RawApiResponse<UserProfile[]>>(url);

      if (data.success) {
        return {
          success: true,
          data: data.data,
          pagination: data.pagination,
        };
      }
      return { success: false, data: [], error: data.error };
    } catch (err) {
      return { success: false, data: [], error: getErrorMessage(err) };
    }
  },

  getById: async (
    userId: string,
  ): Promise<EdgeFunctionResponse<UserProfile>> => {
    try {
      const data = await apiClient.get<RawApiResponse<UserProfile>>(
        `/admin-dashboard/users/${userId}/`,
      );
      if (data.success) {
        return { success: true, data: data.data };
      }
      return { success: false, data: {} as UserProfile, error: data.error };
    } catch (err) {
      return { success: false, data: {} as UserProfile, error: getErrorMessage(err) };
    }
  },

  adjustCoins: async (
    userId: string,
    amount: number,
    description?: string,
  ): Promise<EdgeFunctionResponse<{ new_balance?: number }>> => {
    try {
      const data = await apiClient.post<RawApiResponse<{ new_balance?: number }>>(
        "/admin-dashboard/users/coins/",
        { user_id: userId, amount, description },
      );
      return { success: data.success, data: data.data || {} };
    } catch (err) {
      return { success: false, data: {}, error: getErrorMessage(err) };
    }
  },

  toggleSubscription: async (
    userId: string,
    planType: string,
    status: string,
    expiresAt?: string,
  ): Promise<EdgeFunctionResponse<unknown>> => {
    try {
      const data = await apiClient.post<RawApiResponse<unknown>>(
        "/admin-dashboard/users/subscription/",
        {
          user_id: userId,
          plan_type: planType,
          status,
          expires_at: expiresAt,
        },
      );
      return { success: data.success, data: data.data || data };
    } catch (err) {
      return { success: false, data: {}, error: getErrorMessage(err) };
    }
  },
};

// =====================================================
// PAYMENTS
// =====================================================
export const adminPaymentsApi = {
  list: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<
    EdgeFunctionResponse<PaymentRequest[]> & {
      counts?: Record<string, number>;
    }
  > => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.set("status", params.status);
      if (params?.page) queryParams.set("page", params.page.toString());
      if (params?.limit) queryParams.set("limit", params.limit.toString());

      const query = queryParams.toString();
      const url = `/admin-dashboard/payments/${query ? "?" + query : ""}`;
      const data = await apiClient.get<RawApiResponse<PaymentRequest[]>>(url);

      if (data.success) {
        return {
          success: true,
          data: data.data,
          pagination: data.pagination,
          counts: data.counts,
        };
      }
      return { success: false, data: [], error: data.error };
    } catch (err) {
      return { success: false, data: [], error: getErrorMessage(err) };
    }
  },

  approve: async (paymentId: string): Promise<EdgeFunctionResponse<unknown>> => {
    try {
      const data = await apiClient.post<RawApiResponse<unknown>>(
        "/admin-dashboard/payments/approve/",
        {
          payment_id: paymentId,
        },
      );
      return { success: data.success, data: data.data || data };
    } catch (err) {
      return { success: false, data: {}, error: getErrorMessage(err) };
    }
  },

  reject: async (
    paymentId: string,
    reason: string,
  ): Promise<EdgeFunctionResponse<unknown>> => {
    try {
      const data = await apiClient.post<RawApiResponse<unknown>>(
        "/admin-dashboard/payments/reject/",
        {
          payment_id: paymentId,
          reason,
        },
      );
      return { success: data.success, data: data.data || data };
    } catch (err) {
      return { success: false, data: {}, error: getErrorMessage(err) };
    }
  },
};

// =====================================================
// LOGS
// =====================================================
export const adminLogsApi = {
  getAdminLogs: async (params?: {
    action?: string;
    page?: number;
    limit?: number;
  }): Promise<EdgeFunctionResponse<AdminLog[]>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.action) queryParams.set("action", params.action);
      if (params?.page) queryParams.set("page", params.page.toString());
      if (params?.limit) queryParams.set("limit", params.limit.toString());

      const query = queryParams.toString();
      const url = `/admin-dashboard/logs/${query ? "?" + query : ""}`;
      const data = await apiClient.get<RawApiResponse<AdminLog[]>>(url);

      if (data.success) {
        return { success: true, data: data.data, pagination: data.pagination };
      }
      return { success: false, data: [], error: data.error };
    } catch (err) {
      return { success: false, data: [], error: getErrorMessage(err) };
    }
  },

  getCoinTransactions: async (params?: {
    user_id?: string;
    page?: number;
    limit?: number;
  }): Promise<EdgeFunctionResponse<CoinTransaction[]>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.user_id) queryParams.set("user_id", params.user_id);
      if (params?.page) queryParams.set("page", params.page.toString());
      if (params?.limit) queryParams.set("limit", params.limit.toString());

      const query = queryParams.toString();
      const url = `/admin-dashboard/coin-transactions/${query ? "?" + query : ""}`;
      const data = await apiClient.get<RawApiResponse<CoinTransaction[]>>(url);

      if (data.success) {
        return { success: true, data: data.data, pagination: data.pagination };
      }
      return { success: false, data: [], error: data.error };
    } catch (err) {
      return { success: false, data: [], error: getErrorMessage(err) };
    }
  },
};

// =====================================================
// REFERRALS
// =====================================================
export const adminReferralsApi = {
  getTopReferrers: async (): Promise<EdgeFunctionResponse<ReferralStats[]>> => {
    // Not implemented yet in Django backend
    return { success: true, data: [] };
  },
};
