import type {
  User,
  LoginRequest,
  SignupRequest,
  Service,
  ServiceCreate,
  ServiceUpdate,
  Booking,
  BookingCreate,
  BookingStatusUpdate,
  Availability,
  AvailabilityCreate,
  AvailableSlotsResponse,
  AdminStats,
  ApiError,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Important: Include cookies for authentication
    };

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses (like 204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        const error = data as ApiError;
        throw new Error(error.detail || 'An error occurred');
      }

      return data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Authentication endpoints
  auth = {
    signup: (data: SignupRequest) =>
      this.request<User>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    login: (data: LoginRequest) =>
      this.request<User>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    logout: () =>
      this.request<{ message: string }>('/auth/logout', {
        method: 'POST',
      }),

    me: () => this.request<User>('/auth/me'),
  };

  // Services endpoints
  services = {
    getAll: () => this.request<Service[]>('/services'),

    getById: (id: number) => this.request<Service>(`/services/${id}`),

    create: (data: ServiceCreate) =>
      this.request<Service>('/services', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: number, data: ServiceUpdate) =>
      this.request<Service>(`/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: number) =>
      this.request<{ message: string }>(`/services/${id}`, {
        method: 'DELETE',
      }),
  };

  // Bookings endpoints
  bookings = {
    getAll: () => this.request<Booking[]>('/bookings'),

    getById: (id: number) => this.request<Booking>(`/bookings/${id}`),

    create: (data: BookingCreate) =>
      this.request<Booking>('/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    updateStatus: (id: number, data: BookingStatusUpdate) =>
      this.request<Booking>(`/bookings/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: number) =>
      this.request<{ message: string }>(`/bookings/${id}`, {
        method: 'DELETE',
      }),
  };

  // Availability endpoints
  availability = {
    getRules: () => this.request<Availability[]>('/availability/rules'),

    createRule: (data: AvailabilityCreate) =>
      this.request<Availability>('/availability/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    updateRule: (id: number, data: AvailabilityCreate) =>
      this.request<Availability>(`/availability/rules/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    deleteRule: (id: number) =>
      this.request<{ message: string }>(`/availability/rules/${id}`, {
        method: 'DELETE',
      }),

    getSlots: (serviceId: number, date: string) =>
      this.request<AvailableSlotsResponse>(
        `/availability/slots?target_date=${date}&service_id=${serviceId}`
      ),
  };

  // Admin endpoints
  admin = {
    getStats: () => this.request<AdminStats>('/admin/stats'),
  };
}

export const api = new ApiClient(API_URL);
