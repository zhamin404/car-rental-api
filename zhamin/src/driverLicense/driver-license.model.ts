import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface DriverLicense extends Document {
  number: string;
  issueDate: Date;
  expiryDate: Date;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DriverLicenseSchema = new Schema<DriverLicense>(
  {
    number: {
      type: String,
      required: true,
      unique: [true, "This license number already exists"],
      trim: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: [true, "User already has driver license data"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const DriverLicenseToken = "DriverLicense";
export const DriverLicenseModel = mongoose.model<DriverLicense>(
  DriverLicenseToken,
  DriverLicenseSchema
);

DriverLicenseModel.createIndexes();