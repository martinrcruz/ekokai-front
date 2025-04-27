export interface Parte {
  _id: string;
  date: string;
  description: string;
  type: string;
  state: string;
  facturacion?: number;
  customer?: {
    _id: string;
    name: string;
    zone: string;
  };
  selected?: boolean;
} 