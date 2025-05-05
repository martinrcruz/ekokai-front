export interface Parte {
  _id: string;
  description: string;
  facturacion: number;
  state: string;
  type: string;
  categoria: string;
  asignado: boolean;
  periodicos: boolean;
  date: string;
  zone: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    nifCif: string;
    address: string;
    zone: string;
    phone: string;
    contactName: string;
    code: string;
    photo: string;
  };
  coordinationMethod: string;
  selected?: boolean;
} 