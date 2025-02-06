import mongoose, { Schema, Document } from "mongoose";

export interface IField extends Document {
    fieldCode: string;
    fieldName: string;
    fieldLocation: string;
    extentSizeOfTheField: string;
    fieldCrops: mongoose.Types.ObjectId[];
    fieldStaff: mongoose.Types.ObjectId[];
    fieldEquipments: mongoose.Types.ObjectId[];
    fieldLogs: mongoose.Types.ObjectId[];
    fieldImage: string | null;
}

const field = new Schema<IField>({
    fieldCode: { type: String, required: true, unique: true },
    fieldName: { type: String, required: true },
    fieldLocation: { type: String, required: true },
    extentSizeOfTheField: { type: String, required: true },
    fieldCrops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Crop" }],
    fieldStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
    fieldEquipments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Equipment"}],
    fieldLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Log"}],
    fieldImage: { type: String, required: true },
});

const Field = mongoose.model<any>("Field", field);
export default Field;