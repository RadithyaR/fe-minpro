export interface EventFormikValues {
  userId: number;
  name: string;
  description: string;
  price: number;
  startDate: string;
  endDate: string;
  availableSeats: number;
  eventImage?: File | string;
  locationType: string;
  address?: string;
  city?: string;
  link?: string;
}

export interface EventResponse {
  id?: number;
  userId: number;
  locationType: string;
  address?: string;
  city?: string;
  link?: string;
  name: string;
  description: string;
  eventImage?: string;
  price: number;
  startDate: string;
  endDate: string;
  availableSeats: number;
  createdAt: string;
  statusEvent: string;
  user?: {
    fullName: string;
  };
  status?: string;
}
