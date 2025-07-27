// Types utilitaires pour TypeScript

export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type Required<T> = {
  [P in keyof T]-?: T[P];
};

export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export type Record<K extends keyof any, T> = {
  [P in K]: T;
};

// Types pour les formulaires
export type FormField<T> = {
  value: T;
  error?: string;
  touched?: boolean;
  required?: boolean;
};

export type FormState<T> = {
  [K in keyof T]: FormField<T[K]>;
};

// Types pour les états de chargement
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
}

// Types pour les actions
export interface Action<T = any> {
  type: string;
  payload?: T;
}

// Types pour les événements
export type EventHandler<T = any> = (event: T) => void;

// Types pour les callbacks
export type Callback<T = void> = () => T;
export type CallbackWithParam<P, T = void> = (param: P) => T;

// Types pour les validations
export type ValidationRule<T> = (value: T) => string | undefined;
export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

// Types pour les filtres et recherches
export type FilterFunction<T> = (item: T) => boolean;
export type SortFunction<T> = (a: T, b: T) => number;

// Types pour les permissions
export type Permission = string;
export type PermissionCheck = (permission: Permission) => boolean;

// Types pour les dates
export type DateString = string; // Format ISO 8601
export type TimeString = string; // Format HH:mm

// Types pour les couleurs
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type ColorShade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

// Types pour les tailles
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Types pour les positions
export type Position = 'top' | 'bottom' | 'left' | 'right';
export type Alignment = 'start' | 'center' | 'end';

// Types pour les directions
export type Direction = 'horizontal' | 'vertical';

// Types pour les modes
export type Theme = 'light' | 'dark';
export type Mode = 'view' | 'edit' | 'create' | 'delete';