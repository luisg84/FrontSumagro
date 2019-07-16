import { Producto } from '../model/producto';


export interface Pedido {
  client: string;
  clientAddress: string;
  remissionNumber: number;
  shippingDate: string;
  subOrders: Producto[];
  ingenioId: string;
  
}






