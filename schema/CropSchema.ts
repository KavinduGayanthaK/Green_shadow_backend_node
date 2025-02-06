import mongoose, { Schema, Document } from "mongoose";

export type cropCategoryType = "CEREAL"| "PULSES"| "OILSEED" | "FIBER" | "SUGAR" | "SPICE";
export type cropSeasonType = "YALASEASON" | "MAHASEASON"

export interface ICrop extends Document {
  cropCode: string;
  commonName: string;
  scientificName: string;
  cropCategory: cropCategoryType;
  cropSeason: cropSeasonType;
  cropFields: mongoose.Types.ObjectId[];
  cropLogs: mongoose.Types.ObjectId[];
  cropImage: string;
}

const crop = new Schema<ICrop>({
    cropCode: {type: String, required: true, unique: true},
    commonName: {type: String, required: true},
    scientificName: {type: String, required: true},
    cropCategory: {type: String, required: true},
    cropSeason: {type: String, required: true},
    cropFields: [{type:mongoose.Schema.Types.ObjectId, ref: "Field"}],
    cropLogs: [{type:mongoose.Schema.Types.ObjectId, ref: "Log"}],
    cropImage: { type: String, required: true },
})

const Crop = mongoose.model<any>("Crop",crop);
export default Crop;