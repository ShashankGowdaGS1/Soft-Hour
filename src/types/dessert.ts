export type DessertCollection = 'regular' | 'seasonal';

export type DessertAvailability = 'AVAILABLE' | 'LOW' | 'SOLD OUT';

export interface DessertItem {
  id: string;
  number: string;
  slug: string;
  name: string;
  collection: DessertCollection;
  description: string;
  flavorNotes: string;
  price: string;
  image: string;
  video: string;
  duration: string;
  accent?: string;
  featured?: boolean;
  availability: DessertAvailability;
}

export interface StoreInfo {
  brand: string;
  descriptor: string;
  city: string;
  country: string;
  addressSummary: string;
  hours: string;
  pickupActionText: string;
  directionsActionText: string;
  instagramActionText: string;
  instagramHandle: string;
}
