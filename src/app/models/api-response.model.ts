export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
  token?: string;
  user?: any;
  total?: number;
  page?: number;
  limit?: number;
} 