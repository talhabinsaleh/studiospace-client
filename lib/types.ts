export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  image: string;
  gallery: string[];
  amenities: string[];
  overview: string;
  ownerEmail: string;
  ownerName: string;
  ownerPhoto?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface StudioList {
  items: Studio[];
  total: number;
}

export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  location: string;
  hostEmail: string;
  hostName: string;
  userEmail: string;
  userName: string;
  start: string;
  end: string;
  hours: number;
  guests: number;
  hourlyRate: number;
  securityDeposit: number;
  subtotal: number;
  total: number;
  status: BookingStatus;
  createdAt: string;
}

export interface Review {
  _id: string;
  userEmail: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface StudioFormValues {
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  image: string;
  gallery: string[];
  amenities: string[];
  overview: string;
}
