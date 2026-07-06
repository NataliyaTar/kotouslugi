export interface IGroomingSalon {
  id: number;
  name: string;
  address: string;
  contactPhone: string;
  availableTimes: string;
  providesGroomers: boolean;
}

export interface IGroomer {
  id: number;
  salonId: number;
  fullName: string;
  specialization: string;
  rating: number;
}

export interface IGroomingSlot {
  time: string;
  available: boolean;
}

export interface IGroomingAppointment {
  id: number;
  requisitionId: number;
  catId: number;
  salonId: number;
  groomerId: number;
  packageType: string;
  ownerContact: string;
  notes: string;
  visitDate: string;
  visitTime: string;
  status: 'PENDING' | 'SALON_CONFIRMED' | 'SALON_REJECTED' | 'CANCELLED';
  salonResponse: string;
}
