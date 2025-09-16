export interface Facturacion {
  facturacion: number;
  ruta: {
    _id: string;
    name: string;
  };
  parte: {
    _id: string;
    title: string;
    description: string;
  };
  createdAt: Date;
}

export interface FacturacionResponse {
  ok: boolean;
  facturacion: Facturacion[];
} 