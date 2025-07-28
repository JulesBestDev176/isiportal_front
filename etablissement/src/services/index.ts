// Export de tous les services

export { adminService } from './adminService';
export { authService } from './authService';
export { eleveService } from './eleveService';
export { matiereService } from './matiereService';
export { notificationService } from './notificationService';
export { profileService } from './profileService';
export { logoutService } from './logoutService';
export { bulletinService } from './bulletinService';
export { historiqueElevesService } from './historiqueElevesService';

// Types communs pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Types pour la pagination
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  filters?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 