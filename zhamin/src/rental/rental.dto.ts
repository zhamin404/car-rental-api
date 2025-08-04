import {Status} from "./rental.constants"
import {Schema} from "mongoose"

export type RentalId = string;

export interface CreateRentalDto {
    carId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    rentalStartDate: Date;
    rentalFinishDate: Date;
    oneDayRentalPrice: number;
    status: Status;
}

export interface UpdateRentalDto {
    rentalStartDate: Date,
    rentalFinishDate: Date,
    status: Status
}
