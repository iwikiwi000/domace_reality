// types/nehnutelnost.types.ts
export type NehnutelnostType = 'byt' | 'dom' | 'pozemok';
export type NehnutelnostState = 'predaj' | 'prenajom';

export interface Location {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  houseNumber?: string;
  apartment?: string;
}

export interface Nehnutelnost {
  id: string;
  title: string;
  desc: string;
  price: number;
  location: Location;
  state: NehnutelnostState;
  area: number;
  type: NehnutelnostType;
  rooms?: number;
  bathrooms?: number;
  hasGarage?: boolean;
  hasBalcony?: boolean;
  hasTerrace?: boolean;
  hasElevator?: boolean;
  floor?: number;
  totalFloors?: number;
  constructionYear?: number;
  renovationYear?: number;
  energyClass?: string;
  heatingType?: string;
  condition?: string;
  landType?: string;
  isFenced?: boolean;
  hasUtilities?: boolean;
  utilitiesTypes?: string[];
  terrainType?: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
