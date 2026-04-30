// app/types/order.types.ts
export interface OrderItemDTO {
  productId: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  quantity: number;
  unitPrice: number;
}

export interface DestinationDTO {
  deliveryPointId?: string;
  name: string;
  address: string;
  contactName?: string;
  contactPhone?: string;
  instructions?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PaymentDTO {
  method: 'cash' | 'mpesa' | 'bank_transfer' | 'cheque' | 'credit';
  reference?: string;
  amount: number;
  paidBy?: string;
}

export interface CreateOrderDTO {
  clientId?: string; // If authenticated, can be inferred
  destination: DestinationDTO;
  items: OrderItemDTO[];
  taxRate?: number; // Default 16%
  deposit?: number;
  payments?: PaymentDTO[];
  requestedDeliveryDate: string;
  orderNotes?: string;
  promoCode?: string;
  promoDiscount?: number;
}

export interface OrderResponseDTO {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  deposit: number;
  balance: number;
  destination: DestinationDTO;
  items: OrderItemDTO[];
  orderDate: string;
  requestedDeliveryDate: string;
  promisedDeliveryDate?: string;
  messages: Array<{
    text: string;
    timestamp: string;
    isInternal: boolean;
    messageType: string;
  }>;
  paymentStatus: 'pending' | 'partial' | 'paid';
}

export interface OrderPlacementResult {
  success: boolean;
  order?: OrderResponseDTO;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  requiresPayment?: boolean;
  paymentReference?: string;
}