import mongoose, { Schema, Document } from "mongoose";

export type vehicleFuelType = "PETROL"| "DIESEL"| "ELECTRIC" ;
export type vehicelStatusType = "AVAILABLE" | "OUTOFSERVICE"

export interface IVehicle extends Document {
    licensePlateNumber:string;
    category:string;
    fuelType:vehicleFuelType;
    vehicleStatus:vehicelStatusType;
    specialRemark:string;
    vehicleStaffMember:string;
}

const vehicle = new Schema<IVehicle>({
    licensePlateNumber: {type: String, required: true, unique: true},
    category: {type: String, required: true},
    fuelType: {type: String, required: true},
    vehicleStatus: {type: String, required: true},
    specialRemark: {type: String, required: true},
    vehicleStaffMember: { type: String, required: true, default: null },
})

const Vehicle = mongoose.model<any>("Vehicle",vehicle);
export default Vehicle;