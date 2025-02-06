import mongoose, { Schema, Document } from "mongoose";

export type RoleType = "ADMINISTRATIVE" | "MANAGER" | "SCIENTIFIC" | "OTHER";
export type DesignationType =
  | "ASSISTANTMANAGER"
  | "ADMINANDHRSTAFF"
  | "OFFICEASSISTANT"
  | "SENIORAGRONOMIST"
  | "AGRONOMIST"
  | "SENIORTECHNICIAN"
  | "TECHNICIAN"
  | "SUPERVISOR"
  | "LABOUR";

export type GenderType = "Male" | "Female";

export interface IStaff extends Document {
  staffId: string;
  firstName: string;
  lastName: string;
  designation: DesignationType;
  gender: GenderType;
  joinedDate: string | null;
  dateOfBirth: string | null;
  buildingNumber: string;
  lane: string;
  city: string;
  state: string;
  postalCode: string;
  contactNumber: string;
  email: string;
  role: RoleType;
  fields: mongoose.Types.ObjectId[];
  vehicles: mongoose.Types.ObjectId[];
  equipments: mongoose.Types.ObjectId[];
  logs: mongoose.Types.ObjectId[];
}

const staff = new Schema<IStaff>({
  staffId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  designation: {
    type: String,
    required: true,
    enum: [
      "ASSISTANTMANAGER",
      "ADMINANDHRSTAFF",
      "OFFICEASSISTANT",
      "SENIORAGRONOMIST",
      "AGRONOMIST",
      "SENIORTECHNICIAN",
      "TECHNICIAN",
      "SUPERVISOR",
      "LABOUR",
    ],
  },
  gender: { type: String, required: true,enum:["MALE","FEMALE"] },
  joinedDate: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  buildingNumber: {type: String, required: true},
  lane: {type: String, required: true},
  city: {type: String, required: true},
  state: {type: String, required: true},
  postalCode: {type: String, required: true},
  contactNumber: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  role: { type: String, required: true,enum:["ADMINISTRATIVE","MANAGER","SCIENTIFIC","OTHER"] },
  fields: [{type: mongoose.Schema.Types.ObjectId, ref: "field"}],
  vehicles:[{type: mongoose.Schema.Types.ObjectId, ref: "vehicle"}],
  equipments:[{type: mongoose.Schema.Types.ObjectId, ref: "equipment"}],
  logs:[{type: mongoose.Schema.Types.ObjectId, ref: "equipment"}],
});

const Staff = mongoose.model<any>("Staff",staff);
export default Staff;
