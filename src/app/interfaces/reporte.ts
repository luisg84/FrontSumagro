export interface Orden {
  id: string;
  client: string;
  clientAddress: string;
  remissionNumber: number;
  shippingDate: string;
  subOrders: subOrders[];
  ingenioId: string;
  status: string;
}

export interface subOrders {
  description: string;
  quantity: number;
  unit: string; 
  status: boolean;
}

export interface Ingenio {
  address: string;
  email: string;
  id: string;
  name: string;
}

export interface Status {
  status: string;
}


