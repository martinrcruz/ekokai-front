export interface Parte {
  _id: string;
  title: string;
  description: string;
  date: Date;
  state: 'Pendiente' | 'EnProceso' | 'Finalizado';
  type: 'Obra' | 'Mantenimiento' | 'Correctivo' | 'Visitas';
  categoria: 'Extintores' | 'Incendio' | 'Robo' | 'CCTV' | 'Pasiva' | 'Venta';
  asignado: boolean;
  eliminado: boolean;
  customer: string;
  ruta?: string;
  address: string;
  periodico: boolean;
  frequency?: 'Mensual' | 'Trimestral' | 'Semestral' | 'Anual';
  endDate?: Date;
  coordinationMethod: 'Llamar antes' | 'Coordinar por email' | 'Coordinar según horarios';
  gestiona: number;
  finalizadoTime?: Date;
  facturacion?: number;
  comentarios: Array<{
    texto: string;
    fecha: Date;
    usuario: string;
  }>;
  documentos: Array<{
    nombre: string;
    url: string;
    tipo: string;
    fecha: Date;
  }>;
  createdDate: Date;
} 