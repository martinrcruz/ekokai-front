export interface Cupon {
  _id?: string;
  nombre: string;
  descripcion?: string;
  tokensRequeridos: number;
  fechaExpiracion?: Date | string;
  activo?: boolean;
  fechaCreacion?: Date | string;
} 