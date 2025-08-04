export enum Status {
    Done = 'Done',
    Canceled = 'Canceled'
}

export const limitMaxDays = 28
export const limitMaxDaysInMs = limitMaxDays * 24 * 60 * 60 * 1000

export interface RentalDates {
    rentalStartDate: Date;
    rentalFinishDate: Date;
}

export const RentalErrors = {
    rentalNotFound: 'Rental not found in database',
};