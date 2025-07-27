// Types communs utilisés dans l'application

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface FilterOption {
  key: string;
  value: any;
  operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in';
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchParams {
  query?: string;
  filters?: FilterOption[];
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export type Status = 'active' | 'inactive' | 'pending' | 'suspended';

export interface BaseEntity {
  id: number;
  dateCreation: string;
  dateModification?: string;
  actif: boolean;
}

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}