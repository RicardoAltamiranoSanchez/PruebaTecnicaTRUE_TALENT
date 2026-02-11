export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface Transaction {
  id: string;
  user_id: string;
  monto: number;
  tipo: 'compra' | 'venta' | 'transferencia';
  status: 'pendiente' | 'procesado' | 'fallido';
  created_at: string;
  updated_at?: string;
  processed_at?: string;
}

export interface TransactionCreate {
  user_id: string;
  monto: number;
  tipo: 'compra' | 'venta' | 'transferencia';
}

export interface WebSocketMessage {
  type: string;
  data: {
    transaction_id: string;
    status: 'procesado' | 'fallido';
    updated_at: string;
  };
}
