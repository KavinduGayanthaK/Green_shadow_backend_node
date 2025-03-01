import mongoose from "mongoose";
import { VehicleModel } from "../model/VehicleModel";
import { VehicleRepository } from "../repository/VehicleRepository";
import Vehicle, {
  IVehicle,
  vehicelStatusType,
  vehicleFuelType,
} from "../schema/VehicleSchema";
import Staff from "../schema/StaffSchema";
import { StaffRepository } from "../repository/StaffRepository";

export class VehicleService {
  vehicleRepository = new VehicleRepository();
  staffRepository = new StaffRepository();

  async addVehicle(vehicleData: VehicleModel) {
    try {
      console.log(vehicleData)
      const newVeicle = new Vehicle({
        licensePlateNumber: vehicleData.licensePlateNumber,
        category: vehicleData.category,
        fuelType: vehicleData.fuelType,
        vehicleStatus: vehicleData.vehicleStatus,
        specialRemark: vehicleData.specialRemark,
        vehicleStaffMember: vehicleData.vehicleStaffMember || null,
      });
      const save = await this.vehicleRepository.addVehicle(newVeicle);
      return { message: "Vehicle saved successfully", vehicle: save };
    } catch (error) {
      console.error("Service layer error: Failed to save crops!");
      throw new Error("Failed to save crops. Please try again.");
    }
  }

  async getAllVehicle() {
    try {
      const vehicleList = this.vehicleRepository.getAllVehicles();
      console.log(vehicleList);
      return vehicleList;
    } catch (error) {
      return error;
    }
  }

  async updateVehicleService(vehicleData: VehicleModel) {
    try {
      const existingVehicle = await this.vehicleRepository.findVehicleById(
        vehicleData.licensePlateNumber
      );
      if (!existingVehicle) {
        throw new Error("Vehicle not found!");
      }

      let updatedStaffIds: mongoose.Types.ObjectId[] = [];
      let assignStaffCodes: string[] = [];

      if (
        vehicleData.vehicleStaffMember &&
        Array.isArray(vehicleData.vehicleStaffMember)
      ) {
        const staffDocs = await Staff.find({
          code: { $in: vehicleData.vehicleStaffMember },
        });
        updatedStaffIds = staffDocs.map(
          (staff) => staff._id as mongoose.Types.ObjectId
        );
      }

      const updateData: Partial<IVehicle> = {
        licensePlateNumber: vehicleData.licensePlateNumber,
        category: vehicleData.category,
        fuelType: vehicleData.fuelType as vehicleFuelType,
        vehicleStatus: vehicleData.vehicleStatus as vehicelStatusType,
        specialRemark: vehicleData.specialRemark,
        vehicleStaffMember: updatedStaffIds,
      };

      const result = await this.vehicleRepository.updateVehicle(
        vehicleData.licensePlateNumber,
        updateData
      );
      await this.staffRepository.updateStaffAssignVehicle(
        vehicleData.licensePlateNumber,
        vehicleData
      );

      const getStaff = await this.staffRepository.getSelectedStaff(
        result.assignStaffMembers
      );
      assignStaffCodes = getStaff.map((staff) => staff.code);

      const modifiedResult = {
        ...result.toObject(),
        assignStaffMembers: assignStaffCodes,
      };
      return modifiedResult;
    } catch (e) {
      console.error("Service layer error: Failed to update vehicle!", e);
      throw new Error("Failed to update vehicle, Please try again.");
    }
  }

  async deleteVehicleService(code: string) {
    try {
      const excitingVehicle = await this.vehicleRepository.findVehicleById(code);
      if (!excitingVehicle) {
        throw new Error("Vehicle is not found");
      }
      await this.staffRepository.deleteVehicleInStaff(code);
      return await this.vehicleRepository.deleteVehicle(code);
    } catch (e) {
      console.log("Vehicle service: Failed to delete vehicle", e);
      throw e;
    }
  }
}
