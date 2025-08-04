import mongoose, {Schema, Document} from 'mongoose';
import { Status } from './rental.constants';

export interface Rental extends Document {
    carId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    rentalStartDate: Date;
    rentalFinishDate: Date;
    oneDayRentalPrice: number;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
}

const RentalSchema = new Schema<Rental>({
    carId: {
        type: Schema.Types.ObjectId,
        ref: "Car",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rentalStartDate: {
        type: Date,
        required: true,
    },
    rentalFinishDate: {
        type: Date,
        required: true,
    },
    oneDayRentalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(Status),
        required: true
    } 
   
}, {
    timestamps: true
});

export const RentalToken = 'Rental';
export const RentalModel = mongoose.model<Rental>(RentalToken, RentalSchema);
