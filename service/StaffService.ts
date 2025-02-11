import mongoose from "mongoose";
import { StaffModel } from "../model/StaffModel";
import Field from "../schema/FieldSchema";
import Log from "../schema/LogSchema";
import Vehicle from "../schema/VehicleSchema";
import Equipment from "../schema/EquipmentSchema";
import Staff from "../schema/StaffSchema";
import { saveCropService } from "./CropService";
import { StaffRepository } from "../repository/StaffRepository";

export class StaffService {
  staffRepository = new StaffRepository();
  async addStaff(staffData: StaffModel) {
    try {
      let staffFieldCode: mongoose.Types.ObjectId[] = [];
      let staffLogCode: mongoose.Types.ObjectId[] = [];
      let staffVehicleNumber: mongoose.Types.ObjectId[] = [];
      let staffEquipmentId: mongoose.Types.ObjectId[] = [];

      const staffFieldDocs = await Field.find({
        code: { $in: staffData.fields },
      }).lean<{ _id: mongoose.Types.ObjectId }[]>();
      staffFieldCode = staffFieldDocs.map((field) => field._id);

      const staffLogDocs = await Log.find({
        code: { $in: staffData.logs },
      }).lean<{ _id: mongoose.Types.ObjectId }[]>();
      staffLogCode = staffLogDocs.map((log) => log._id);

      const staffVehicleDocs = await Vehicle.find({
        licensePlateNumber: { $in: staffData.vehicles },
      }).lean<{ _id: mongoose.Types.ObjectId; licensePlateNumber: string }[]>();

      staffVehicleNumber = staffVehicleDocs.map((vehicle) => vehicle._id);

      const staffEquipmentDocs = await Equipment.find({
        id: { $in: staffData.equipments },
      }).lean<{ _id: mongoose.Types.ObjectId }[]>();
      staffEquipmentId = staffEquipmentDocs.map((equipment) => equipment._id);

      const newStaff = new Staff({
        staffId: staffData.staffId,
        firstName: staffData.firstName,
        lastName: staffData.lastName,
        designation: staffData.designation,
        gender: staffData.gender,
        joinedDate: staffData.joinedDate,
        dateOfBirth: staffData.dateOfBirth,
        buildingNumber: staffData.buildingNumber,
        lane: staffData.lane,
        city: staffData.city,
        state: staffData.state,
        postalCode: staffData.postalCode,
        contactNumber: staffData.contactNumber,
        email: staffData.email,
        role: staffData.role,
        fields: staffFieldCode,
        vehicles: staffVehicleNumber,
        equipments: staffEquipmentId,
        logs: staffLogCode,
      });
      const savedStaff = await this.staffRepository.addStaff(newStaff);
      if (!savedStaff || !savedStaff._id) {
        throw new Error("Failed to save staff.");
      }
      if (staffVehicleNumber.length > 0) {
        await Vehicle.updateMany(
          { _id: { $in: staffVehicleNumber } },
          { $set: { vehicleStaffMember: savedStaff._id } } // Assign staff to the vehicle
        );
      }

      return { message: "Staff added successfully", staff: savedStaff };
    } catch (error) {
      console.error("Service layer error: Failed to save staff!");
      throw new Error("Failed to save staff. Please try again.");
    }
  }
}
