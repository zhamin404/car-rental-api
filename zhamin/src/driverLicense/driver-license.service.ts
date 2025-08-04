import { DriverLicense, DriverLicenseModel } from "./driver-license.model";

export async function createDriverLicense(
  data: DriverLicense
): Promise<DriverLicense> {
  try {
    return await DriverLicenseModel.create(data);
  } catch (error) {
    throw error
  }
}

export async function getDriverLicenseByUserId(
  userId: string
): Promise<DriverLicense | null> {
  return await DriverLicenseModel.findOne({ userId });
}

export async function updateDriverLicense(
  userId: string,
  data: DriverLicense
): Promise<DriverLicense | null> {
  return await DriverLicenseModel.findOneAndUpdate(
    { userId },
    data,
    { new: true }
  );
}

export async function deleteDriverLicense(
  userId: string
): Promise<DriverLicense | null> {
  return await DriverLicenseModel.findOneAndDelete({ userId });
}
