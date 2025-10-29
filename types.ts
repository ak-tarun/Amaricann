
// --- Enums ---
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  STAFF = 'staff',
  STUDENT = 'student',
}

export enum PaymentMethod {
  UPI = 'upi',
  GATEWAY = 'gateway',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LEAVE = 'leave',
}

export enum SocialLinkStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// --- Interfaces ---

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  fee: number;
  duration: string; // e.g., "3 months", "60 hours"
  image?: string; // URL to cover image
  created_at?: string;
  updated_at?: string;
}

export interface Lecture {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  video_url: string; // YouTube, Vimeo, or local URL
  duration?: string; // e.g., "30 min"
  is_preview: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  status: 'enrolled' | 'completed' | 'dropped';
  enrolled_at: string;
  created_at?: string;
  updated_at?: string;
  course?: Course; // Optional: to populate course details
}

export interface Payment {
  id: number;
  user_id: number;
  course_id?: number; // Can be null for general payments, but typically for a course
  amount: number;
  txn_id?: string; // Transaction ID from UPI or Gateway
  method: PaymentMethod;
  status: PaymentStatus;
  screenshot_url?: string; // For UPI manual verification
  created_at: string;
  updated_at?: string;
  user?: User; // Optional: to populate user details
  course?: Course; // Optional: to populate course details
}

export interface Attendance {
  id: number;
  user_id: number;
  course_id: number;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  created_at?: string;
  updated_at?: string;
  user?: User; // Optional: to populate user details
  course?: Course; // Optional: to populate course details
}

export interface TimetableEntry {
  id: number;
  course_id: number;
  day_of_week: string; // e.g., 'Monday', 'Tuesday'
  start_time: string; // e.g., '09:00'
  end_time: string; // e.g., '10:30'
  created_at?: string;
  updated_at?: string;
  course?: Course; // Optional: to populate course details
}

export interface Certificate {
  id: number;
  user_id: number;
  course_id: number;
  cert_no: string; // Unique certificate number
  pdf_url: string; // URL to the generated PDF certificate
  issued_at: string; // YYYY-MM-DD
  created_at?: string;
  updated_at?: string;
  user?: User; // Optional: to populate user details
  course?: Course; // Optional: to populate course details
}

export interface Setting {
  key: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

export interface PrivacyPolicy {
  id: number;
  content: string; // Markdown content
  updated_by: number; // User ID of who updated it
  updated_at: string;
  updater_name?: string; // Optional: to show who updated it
}

export interface SocialLink {
  id: number;
  platform: string;
  icon: string; // Font Awesome class, e.g., 'fab fa-facebook'
  url: string;
  status: SocialLinkStatus;
  created_at?: string;
  updated_at?: string;
}

// --- API Responses ---
export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: { [key: string]: string[] };
}
