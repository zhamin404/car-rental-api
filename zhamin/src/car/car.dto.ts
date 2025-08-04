export type CarId = string;
export enum SortBy {
  YEAR = 'year',
  RATE = 'rate',
  BRAND = 'brand',
  NAME = 'name',
}

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export interface CarFilter {
  isActive: boolean;
  rate?: {
    $gte?: number;
    $lte?: number;
  },
  year?: {
    $gte?: number;
    $lte?: number;
  }
}

export interface CreateCarDto {
  brand: string;
  name: string;
  year: number;
  rate: number;
  image?: string;
}

export interface UpdateCarDto {
  brand?: string;
  name?: string;
  year?: number;
  rate?: number;
  image?: string;
  isActive?: boolean;
}
