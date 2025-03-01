import mongoose, { Schema, Document } from "mongoose";

export type LogType = "NORMAL" | "DANGER";

export interface ILog extends Document {
  logCode: string;
  logDate: string | null;
  logDetails: string;
  logType: LogType;
  logImage: string;
  logFields: mongoose.Types.ObjectId[];
  logCrops: mongoose.Types.ObjectId[];
  logStaff: mongoose.Types.ObjectId[];
}

const log = new Schema<ILog>({
  logCode: { type: String, required: true, unique: true },
  logDate: { type: String, required: true },
  logDetails: { type: String, required: true },
  logType: { type: String, required: true },
  logImage: { type: String, required: true },
  logFields: [{ type: mongoose.Schema.Types.ObjectId, ref: "Field" }],
  logCrops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Crop" }],
  logStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
});

const Log = mongoose.model<any>("Log", log);
export default Log;
