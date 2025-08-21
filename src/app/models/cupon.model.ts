export interface Cupon {
  _id?: string;
  nombre: string;
  descripcion?: string;
  tokensRequeridos: number;
  fechaExpiracion?: Date | string;
  activo?: boolean;
  fechaCreacion?: Date | string;
  // Nuevos campos para funcionalidades avanzadas
  codigo?: string;
  tipo?: 'general' | 'personalizado' | 'masivo';
  cantidadDisponible?: number;
  cantidadUtilizada?: number;
  usuariosAsociados?: UsuarioAsociado[];
  comerciosAsociados?: ComercioAsociado[];
  maxUsosPorUsuario?: number;
  requiereAprobacion?: boolean;
  historialUso?: HistorialUso[];
}

export interface UsuarioAsociado {
  usuarioId: string;
  fechaAsociacion?: Date | string;
  utilizado?: boolean;
  fechaUso?: Date | string;
  // Campos populados
  usuario?: {
    nombre?: string;
    apellido?: string;
    email?: string;
  };
}

export interface ComercioAsociado {
  comercioId: string;
  fechaAsociacion?: Date | string;
  // Campos populados
  comercio?: {
    nombre?: string;
    apellido?: string;
    email?: string;
  };
}

export interface HistorialUso {
  usuarioId: string;
  fechaUso?: Date | string;
  tokensGastados?: number;
  comercioId?: string;
  // Campos populados
  usuario?: {
    nombre?: string;
    apellido?: string;
    email?: string;
  };
  comercio?: {
    nombre?: string;
    direccion?: string;
  };
}

export interface Canje {
  _id?: string;
  cuponId: string;
  usuarioId: string;
  comercioId?: string;
  tokensGastados: number;
  fechaCanje?: Date | string;
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'completado';
  observaciones?: string;
  aprobadoPor?: string;
  fechaAprobacion?: Date | string;
  // Campos populados
  cupon?: {
    nombre?: string;
    codigo?: string;
  };
  usuario?: {
    nombre?: string;
    apellido?: string;
    email?: string;
  };
  comercio?: {
    nombre?: string;
    apellido?: string;
    email?: string;
  };
  aprobador?: {
    nombre?: string;
    apellido?: string;
  };
} 