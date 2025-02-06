import mongoose, { Schema, Document } from "mongoose";

export type EquepmentType = "ELECTRICAL"| "DIESEL";
export type EquepmentStatusType = "AVAILABLE" | "OUTOFSERVICE"

export interface IEquipment extends Document {
    equipmentId:string;
    equipmentName:string;
    equipmentType:EquepmentType;
    totalCount:number;
    status:EquepmentStatusType;
    equipmentFields:mongoose.Types.ObjectId[];
    equipmentStaffMembers:mongoose.Types.ObjectId[];
}

const equipment = new Schema<IEquipment>({
    equipmentId: {type: String, required: true, unique: true},
    equipmentName: {type: String, required: true},
    equipmentType: {type: String, required: true},
    totalCount: {type: Number, required: true},
    status: {type: String, required: true},
    equipmentFields: [{ type: mongoose.Schema.Types.ObjectId, ref: "Field"}],
    equipmentStaffMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff"}],
});
        

const Equipment = mongoose.model<any>("Equipment",equipment);
export default Equipment;