export interface Articulo {
  _id?: string;
  cantidad: number;
  codigo: string;
  grupo: string;
  familia: string;
  descripcionArticulo: string;
  precioVenta: number;
  createdAt?: Date;
  updatedAt?: Date;
  eliminado?: boolean;
} 