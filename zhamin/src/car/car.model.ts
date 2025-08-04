    import mongoose, {Schema, Document} from 'mongoose';

export interface Car extends Document {
    brand: string;
    name: string;
    year: number;
    rate: number;
    image: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CarSchema = new Schema<Car>({
    brand: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear()
    },
    rate: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: (value: number) => Number.isInteger(value),
            message: 'rate must be an integer'
        }
    },
    image: {
        type: String,
        required: false,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const CarToken = 'Car';
export const CarModel = mongoose.model<Car>(CarToken, CarSchema);
