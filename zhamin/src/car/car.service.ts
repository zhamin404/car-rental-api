import { Car, CarModel } from "./car.model";
import { CarId, CreateCarDto, UpdateCarDto, CarFilter } from "./car.dto";
import { SortOrder } from "mongoose";

export async function createCar(car: CreateCarDto): Promise<Car> {
  return CarModel.create(car);
}

export async function getCarById(id: CarId): Promise<Car | null> {
  return CarModel.findById(id);
}

export async function getAllCars(
  sortBy: string | undefined,
  order: SortOrder = "asc",
  minPrice: string | undefined,
  maxPrice: string | undefined,
  minYear: string | undefined,
  maxYear: string | undefined
): Promise<Car[]> {
  const filter: CarFilter = { isActive: true };

  if (minPrice !== undefined) filter.rate = { $gte: +minPrice };
  if (maxPrice !== undefined) filter.rate = { ...filter.rate, $lte: +maxPrice };
  if (minYear !== undefined) filter.year = { $gte: +minYear };
  if (maxYear !== undefined) filter.year = { ...filter.year, $lte: +maxYear };
  
  const carData = CarModel.find(filter);
  return sortBy ? carData.sort({ [sortBy]: order }) : carData;
}

export async function getIsActivceCar(id: CarId): Promise<Car> {
  return CarModel.findById(id).select("isActive");
}
export async function updateCar(
  id: CarId,
  data: UpdateCarDto
): Promise<Car | null> {
  return CarModel.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteCar(id: CarId): Promise<Car | null> {
  return CarModel.findByIdAndDelete(id);
}
