import { Rental, RentalModel } from "./rental.model";
import { RentalId, CreateRentalDto, UpdateRentalDto } from "./rental.dto";
import { Types } from "mongoose";
import { CarId } from "../car/car.dto";
import { Status } from "./rental.constants";

export async function createRental(car: CreateRentalDto): Promise<Rental> {
  return RentalModel.create(car);
}

export async function getRentalById(
  id: RentalId,
  userId: String
): Promise<Rental | null> {
  return RentalModel.findOne({ _id: id, userId });
}

export async function getAllRentals(): Promise<Rental[]> {
  return RentalModel.find();
}
export async function getRentals(userId: string): Promise<Rental[]> {
  return RentalModel.find({ userId });
}

export async function getRentalStatistics(): Promise<Rental[]>{
  return RentalModel.aggregate([
        {
          $match: { status: "Completed" }  
        },
        {
          $group: {                      
            _id: "$carId",
            completedRentalsCount: { $sum: 1 }
          }
        },
        {
          $lookup: {                     
            from: "cars",
            localField: "_id",
            foreignField: "_id",
            as: "car"
          }
        },
        {
          $unwind: "$car"                
        },
        {
          $project: {                    
            _id: 1,
            carTitle: "$car.name",
            carYear: "$car.year",
            completedRentalsCount: 1
          }
        }
    ]);
}
export async function getDoneRentalsByCarId(id: CarId) {
  return RentalModel.aggregate([
    { $match: { carId: new Types.ObjectId(id), status: Status.Done } },
    {
      $project: {
        _id: 1,
        rentalStartDate: 1,
        rentalFinishDate: 1,
      },
    },
  ]);
}

export async function getStartDateOnRental(id: RentalId) {
  return RentalModel.findById(id).select("rentalStartDate");
}

export async function getUserIdOnRentalsById(id: RentalId) {
  return RentalModel.findById(id).select("userId")
}
export async function updateRental(id: RentalId,data: UpdateRentalDto): Promise<Rental | null> {
  return RentalModel.findByIdAndUpdate(id, data, { new: true });
}

export async function canceleRental(id: RentalId, status = Status.Canceled) {
  return RentalModel.findByIdAndUpdate(id, {status}, { new: true });
}
