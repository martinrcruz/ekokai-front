export interface Articulo {
  _id?: string;
  cantidad: number;
  codigo: string;
  grupo: string;
  familia: string;
  descripcionArticulo: string;
  precioVenta: number;
  createdDate?: Date;
  updatedDate?: Date;
  eliminado?: boolean;
} 