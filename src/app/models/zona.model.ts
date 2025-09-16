export interface Zona {
  _id: string;
  name: string;
  description: string;
  status: string;
  users?: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
  }>;
  rutas?: Array<{
    _id: string;
    name: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
  eliminado?: boolean;
  __v?: number;
} 