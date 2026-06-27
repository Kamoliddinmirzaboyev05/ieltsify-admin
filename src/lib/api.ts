const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://ieltsify-backend.onrender.com";

// API Response Types
export interface LoginResponse {
  access: string;
  refresh: string;
  role: string;
}

export interface ApiError {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}

// API Client Class - Django Backend bilan ishlash
class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage() {
    this.accessToken = sessionStorage.getItem("access_token");
    this.refreshToken = sessionStorage.getItem("refresh_token");
  }

  private saveTokensToStorage(access: string, refresh: string) {
    this.accessToken = access;
    this.refreshToken = refresh;
    sessionStorage.setItem("access_token", access);
    sessionStorage.setItem("refresh_token", refresh);
  }

  private clearTokensFromStorage() {
    this.accessToken = null;
    this.refreshToken = null;
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("user");
  }

  // Auth Methods - Django JWT
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Login xatosi");
    }

    const data = await response.json();
    this.saveTokensToStorage(data.access, data.refresh);
    return data;
  }

  async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error("No refresh token");
    }

    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: this.refreshToken }),
    });

    if (!response.ok) {
      this.clearTokensFromStorage();
      throw new Error("Session expired");
    }

    const data = await response.json();
    this.accessToken = data.access;
    sessionStorage.setItem("access_token", data.access);
    return data.access;
  }

  logout() {
    this.clearTokensFromStorage();
    window.location.href = "/login";
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  private async authenticatedFetch(
    url: string,
    options: RequestInit = {},
  ): Promise<Response> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    // Token expired - try refresh
    if (response.status === 401) {
      try {
        await this.refreshAccessToken();
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${this.accessToken}`,
          },
        });
      } catch {
        this.logout();
        throw new Error("Session expired");
      }
    }

    return response;
  }

  // Generic GET request
  async get<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await this.authenticatedFetch(url, {
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.detail || error.message || `HTTP ${response.status}`,
      );
    }

    return response.json();
  }

  // Generic POST request
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await this.authenticatedFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.detail || error.message || `HTTP ${response.status}`,
      );
    }

    return response.json();
  }

  // Generic PUT request
  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await this.authenticatedFetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.detail || error.message || `HTTP ${response.status}`,
      );
    }

    return response.json();
  }

  // Generic PATCH request
  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await this.authenticatedFetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.detail || error.message || `HTTP ${response.status}`,
      );
    }

    return response.json();
  }

  // Generic DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await this.authenticatedFetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 204) {
      return {} as T;
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.detail || error.message || `HTTP ${response.status}`,
      );
    }

    return response.json();
  }

  // File upload with FormData
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await this.authenticatedFetch(url, {
      method: "POST",
      body: formData,
      // No Content-Type header - browser sets it with boundary for multipart
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.detail || error.message || `HTTP ${response.status}`,
      );
    }

    return response.json();
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
