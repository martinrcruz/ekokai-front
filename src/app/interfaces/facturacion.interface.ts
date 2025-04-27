export interface Facturacion {
  facturacion: number;
  ruta: {
    _id: string;
    name: {
      _id: string;
      name: string;
    };
  };
  parte: {
    _id: string;
    description: string;
  };
  createdDate: string;
}

export interface FacturacionResponse {
  ok: boolean;
  facturacion: Facturacion[];
} 