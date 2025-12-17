// User types
export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'customer' | 'admin';
  is_active: boolean;
}

export interface AuthResponse {
  user: User;
  access_token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  full_name: string;
}

// Service types
export interface Service {
  id: number;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  created_at: string;
}

export interface ServiceCreate {
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
}

export interface ServiceUpdate {
  name?: string;
  description?: string;
  duration_minutes?: number;
  price?: number;
  is_active?: boolean;
}

// Booking types
export interface Booking {
  id: number;
  user_id: number;
  service_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface BookingCreate {
  service_id: number;
  booking_date: string;
  start_time: string;
}

export interface BookingStatusUpdate {
  status: 'confirmed' | 'cancelled';
}

// Availability types
export interface Availability {
  id: number;
  day_of_week: number; // 0=Monday, 6=Sunday
  start_time: string;
  end_time: string;
  is_blocked: boolean;
}

export interface AvailabilityCreate {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_blocked?: boolean;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
}

export interface AvailableSlotsResponse {
  date: string;
  day_of_week: number;
  available_slots: TimeSlot[];
}

// Admin types
export interface AdminStats {
  total_bookings: number;
  pending_bookings: number;
  confirmed_bookings: number;
  total_revenue: number;
  active_services: number;
}

// API Error type
export interface ApiError {
  detail: string;
}
