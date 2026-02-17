// API Base URL
const API_BASE_URL = 'https://ieltsify.pythonanywhere.com';

// API Response Types
export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface ApiError {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage() {
    this.accessToken = sessionStorage.getItem('access_token');
    this.refreshToken = sessionStorage.getItem('refresh_token');
  }

  private saveTokensToStorage(access: string, refresh: string) {
    this.accessToken = access;
    this.refreshToken = refresh;
    sessionStorage.setItem('access_token', access);
    sessionStorage.setItem('refresh_token', refresh);
  }

  private clearTokensFromStorage() {
    this.accessToken = null;
    this.refreshToken = null;
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Merge with provided headers
    if (options.headers) {
      const providedHeaders = options.headers as Record<string, string>;
      Object.assign(headers, providedHeaders);
    }

    // Always reload tokens from storage before making request
    this.loadTokensFromStorage();

    // Debug: Log token status
    if (!endpoint.includes('/token')) {
      console.log('API Request:', endpoint);
      console.log('Access Token:', this.accessToken ? 'Present' : 'Missing');
    }

    if (this.accessToken && !endpoint.includes('/token')) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized - Try to refresh token
      if (response.status === 401 && !endpoint.includes('/token')) {
        console.log('Access token expired, trying to refresh...');
        try {
          const newAccessToken = await this.refreshAccessToken();
          if (newAccessToken) {
            console.log('Token refresh successful, retrying request...');
            // Update header with new token
            headers['Authorization'] = `Bearer ${newAccessToken}`;
            // Retry original request
            const retryResponse = await fetch(url, {
              ...options,
              headers,
            });
            
            if (retryResponse.ok) {
              return await retryResponse.json();
            }
            // If retry also fails, fall through to error handling
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          this.clearTokensFromStorage();
          sessionStorage.removeItem('user'); // Also clear user data
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
      }

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = await response.json();
          
          // Handle different error response formats
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        } catch {
          // If JSON parsing fails, use status-based messages
          if (response.status === 401) {
            errorMessage = 'Autentifikatsiya xatosi! Qaytadan login qiling.';
          } else if (response.status === 403) {
            errorMessage = 'Kirish taqiqlangan!';
          } else if (response.status === 404) {
            errorMessage = 'API endpoint topilmadi!';
          } else if (response.status === 500) {
            errorMessage = 'Server xatosi yuz berdi!';
          }
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Tarmoq xatosi yuz berdi!');
    }
  }

  // Auth Methods
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/token/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    console.log('Login successful, tokens received:', {
      access: response.access ? 'Present' : 'Missing',
      refresh: response.refresh ? 'Present' : 'Missing'
    });

    this.saveTokensToStorage(response.access, response.refresh);
    
    // Verify tokens were saved
    console.log('Tokens saved to sessionStorage:', {
      access: sessionStorage.getItem('access_token') ? 'Present' : 'Missing',
      refresh: sessionStorage.getItem('refresh_token') ? 'Present' : 'Missing'
    });

    return response;
  }

  async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<{ access: string }>('/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: this.refreshToken }),
    });

    this.accessToken = response.access;
    sessionStorage.setItem('access_token', response.access);
    return response.access;
  }

  logout() {
    this.clearTokensFromStorage();
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Generic GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // Generic POST request
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Generic PUT request
  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Generic DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // File upload with FormData
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {};

    // Always reload tokens from storage before making request
    this.loadTokensFromStorage();

    // Debug: Log token status and FormData contents
    console.log('Upload Request:', endpoint);
    console.log('Access Token:', this.accessToken ? 'Present' : 'Missing');
    console.log('FormData contents:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}:`, value);
      }
    }

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      // Handle 401 Unauthorized - Try to refresh token
      if (response.status === 401 && !endpoint.includes('/token')) {
        console.log('Access token expired during upload, trying to refresh...');
        try {
          const newAccessToken = await this.refreshAccessToken();
          if (newAccessToken) {
            console.log('Token refresh successful, retrying upload...');
            headers['Authorization'] = `Bearer ${newAccessToken}`;
            
            const retryResponse = await fetch(url, {
              method: 'POST',
              headers,
              body: formData,
            });
            
            if (retryResponse.ok) {
              return await retryResponse.json();
            }
          }
        } catch (refreshError) {
          console.error('Token refresh failed during upload:', refreshError);
          this.clearTokensFromStorage();
          sessionStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
      }

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        let errorDetails = '';
        
        try {
          const errorData = await response.json();
          console.error('Server error response:', errorData);
          
          // Build detailed error message
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (typeof errorData === 'object') {
            // Handle field-specific errors
            const fieldErrors: string[] = [];
            for (const [field, errors] of Object.entries(errorData)) {
              if (Array.isArray(errors)) {
                fieldErrors.push(`${field}: ${errors.join(', ')}`);
              } else {
                fieldErrors.push(`${field}: ${errors}`);
              }
            }
            if (fieldErrors.length > 0) {
              errorDetails = fieldErrors.join('; ');
              errorMessage = `Validation error: ${errorDetails}`;
            }
          }
        } catch {
          if (response.status === 401) {
            errorMessage = 'Autentifikatsiya xatosi! Qaytadan login qiling.';
          } else if (response.status === 400) {
            errorMessage = 'Ma\'lumotlar noto\'g\'ri! Barcha maydonlarni to\'ldiring.';
          } else if (response.status === 500) {
            errorMessage = 'Server xatosi yuz berdi!';
          }
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Tarmoq xatosi yuz berdi!');
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
