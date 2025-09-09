export interface CheckoutFormikValues {
  quantity: number;
  voucherId?: string;
  pointsToUse: number;
  couponNominal: number;
  eventId: number;
}

export interface Voucher {
  id: number;
  nominal: number;
  eventId: number;
  userId: number;
  quota: number;
  isUsed: boolean;
  createdAt?: string;
  updatedAt?: string;
  event?: {
    id: number;
    name: string;
    price: number;
    startDate: string;
    endDate: string;
    locationType: string;
  };
  user?: {
    id: number;
    fullName: string;
    email: string;
  };
}
