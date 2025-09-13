export interface PaymentFormikValues {
  paymentProof?: File | string;
  id: number;
}

export interface TransactionResponse {
  id: number;
  userId?: number;
  eventId?: number;
  quantity?: number;
  baseAmount?: number;
  discountCoupon?: number;
  discountVoucher?: number;
  discountPoint?: number;
  finalAmount: number;
  voucherId?: number;
  paymentProof?: string;
  statusId?: number;
  user?: {
    id: number;
    fullName: string;
  };
  event?: {
    id: number;
    name: string;
  };
  status?: {
    id: number;
    name: string;
  };
}
