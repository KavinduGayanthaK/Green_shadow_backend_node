import mongoose from "mongoose";
import { StaffModel } from "../model/StaffModel";
import Field from "../schema/FieldSchema";
import Log from "../schema/LogSchema";
import Vehicle from "../schema/VehicleSchema";
import Equipment from "../schema/EquipmentSchema";
import Staff, { DesignationType,GenderType, IStaff, RoleType } from "../schema/StaffSchema";
import { StaffRepository } from "../repository/StaffRepository";
import { VehicleRepository } from "../repository/VehicleRepository";
import { FieldRepository } from "../repository/FieldRepository";
import { LogRepository } from "../repository/LogRepository";
import { EquipmentRepository } from "../repository/EquipmentRepository";

export class StaffService {
  staffRepository = new StaffRepository();
  vehicleRepository = new VehicleRepository();
  fieldRepository = new FieldRepository();
  logRepository = new LogRepository();
  equipmentRepository = new EquipmentRepository();

  async generateStaffId(): Promise<string> {
    try {
      const lastStaff = await Staff.findOne()
        .sort({ staffId: -1 })
        .lean<{ staffId: string } | null>();
      if (lastStaff?.staffId) {
        const lastIdNumber = parseInt(
          lastStaff.staffId.replace("STAFF-", ""),
          10
        );
        return `STAFF-${(lastIdNumber + 1).toString().padStart(3, "0")}`;
      }
      return "STAFF-001";
    } catch (error) {
      console.error("Error generating staff ID:", error);
      throw new Error("Failed to generate Staff ID.");
    }
  }

  async addStaff(staffData: StaffModel) {
    try {
      let assignVehicleIds: mongoose.Types.ObjectId[] = [];
      let assignLogIds: mongoose.Types.ObjectId[] = [];
      let assignFieldIds: mongoose.Types.ObjectId[] = []; 
      let assignEquipmentIds: mongoose.Types.ObjectId[] = [];
      let assignFieldNames: string[] = [];
      let assignLogNames: string[] = [];
      let assignVehicleNames: string[] = [];
      let assignEquipmentNames: string[] = [];

      const vehicleDocs = await Vehicle.find({
        licensePlateNumber: { $in: staffData.vehicles },
      }).lean<{ _id: mongoose.Types.ObjectId }[]>();
      assignVehicleIds = vehicleDocs.map((vehicle) => vehicle._id);
      

      const logDocs = await Log.find({ code: { $in: staffData.logs } }).lean<
        { _id: mongoose.Types.ObjectId }[]
      >();
      assignLogIds = logDocs.map((log) => log._id);

      const fieldDocs = await Field.find({
        code: { $in: staffData.fields },
      }).lean<{ _id: mongoose.Types.ObjectId }[]>();
      assignFieldIds = fieldDocs.map((field) => field._id);

      const equipmentDocs = await Equipment.find({
        code: { $in: staffData.equipments },
      }).lean<{ _id: mongoose.Types.ObjectId }[]>();
      assignEquipmentIds = equipmentDocs.map((equipment) => equipment._id);

      const newStaffId = await this.generateStaffId();
      staffData.staffId = newStaffId;
      console.log(assignVehicleIds)
      const newStaff = new Staff({
        staffId: newStaffId,
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
        fields: assignFieldIds,
        vehicles: assignVehicleIds,
        equipments: assignEquipmentIds,
        logs: assignLogIds,
      });
      console.log(staffData)
      const result = await this.staffRepository.addStaff(newStaff);

      await this.vehicleRepository.updateVehicleAssignStaff(staffData.staffId, staffData);
      await this.logRepository.updateLogAssignStaff(staffData.staffId, staffData);
      await this.fieldRepository.updateFieldAssignStaff(staffData.staffId, staffData);
      await this.equipmentRepository.updateEquipmentAssignStaff(staffData.staffId, staffData);

      const getVehicles = await this.vehicleRepository.getSelectedVehicles(result.assignVehicles);
      assignVehicleNames = getVehicles.map((vehicle) => vehicle.vehicleName);

      const getLogs = await this.logRepository.getSelectedLogs(result.assignLogs);
      assignLogNames = getLogs.map((log) => log.name);

      const getFields = await this.fieldRepository.getSelectedField(result.assignFields);
      assignFieldNames = getFields.map((field) => field.name);

      const getEquipments = await this.equipmentRepository.getSelectedEquipment(
        result.assignEquipments
      );
      assignEquipmentNames = getEquipments.map((equ) => equ.name);

      const modifiedResult = {
        ...result.toObject(),
        assignVehicles: assignVehicleNames,
        assignLogs: assignLogNames,
        assignFields: assignFieldNames,
        assignEquipments: assignEquipmentNames,
      };
      return modifiedResult;
    } catch (error) {
      console.error("Service layer error: Failed to save staff! : ", error);
      throw new Error("Failed to save staff. Please try again.");
    }
  }

  async getAllStaff() {
    try {
      const staffList = await this.staffRepository.getAllStaff();
      

      return staffList;
    } catch (error) {
      return error;
    }
  }

  async updateStaff(id:string,staffData: StaffModel) {
    try {
      console.log("update staff",staffData);
      
      const excitingStaff = await this.staffRepository.findStaffById(id);
      if (!excitingStaff) {
        throw new Error("Staff member not found");
      }

      let updatedVehicleIds: mongoose.Types.ObjectId[] = [];
      let updatedFieldIds: mongoose.Types.ObjectId[] = [];
      let updatedLogIds: mongoose.Types.ObjectId[] = [];
      let updateEquipmentIds: mongoose.Types.ObjectId[] = [];
      let assignFieldNames: string[] = [];
      let assignLogNames: string[] = [];
      let assignVehicleNames: string[] = [];
      let assignEquipmentNames: string[] = [];

      if (
        (staffData.vehicles && Array.isArray(staffData.vehicles)) ||
        (staffData.fields && Array.isArray(staffData.fields)) ||
        (staffData.logs && Array.isArray(staffData.logs)) ||
        (staffData.equipments &&
          Array.isArray(staffData.equipments))
      ) {
        const vehicleDocs = await Vehicle.find({
          licensePlateNumber: { $in: staffData.vehicles },
        });
        updatedVehicleIds = vehicleDocs.map(
          (vehicle) => vehicle._id as mongoose.Types.ObjectId
        );

        const fieldDocs = await Field.find({
          fieldCode: { $in: staffData.fields },
        });
        updatedFieldIds = fieldDocs.map(
          (field) => field._id as mongoose.Types.ObjectId
        );

        const logDocs = await Log.find({ logCode: { $in: staffData.logs } });
        updatedLogIds = logDocs.map(
          (log) => log._id as mongoose.Types.ObjectId
        );

        const equDocs = await Equipment.find({
          equipmentId: { $in: staffData.equipments },
        });
        updateEquipmentIds = equDocs.map(
          (equ) => equ._id as mongoose.Types.ObjectId
        );
      }

      const updateData: Partial<IStaff> = {
        firstName: staffData.firstName,
        lastName: staffData.lastName,
        designation: staffData.designation as DesignationType,
        gender: staffData.gender as GenderType,
        joinedDate: staffData.joinedDate,
        dateOfBirth: staffData.dateOfBirth,
        buildingNumber: staffData.buildingNumber,
        lane: staffData.lane,
        city: staffData.city,
        state: staffData.state,
        postalCode: staffData.postalCode,
        contactNumber: staffData.contactNumber,
        email: staffData.email,
        role: staffData.role as RoleType,
        fields: updatedFieldIds,
        vehicles: updatedVehicleIds,
        equipments: updateEquipmentIds,
        logs: updatedLogIds,
      };

      const result = await this.staffRepository.updateStaff(staffData.staffId, updateData);
      await this.vehicleRepository.updateVehicleAssignStaff(staffData.staffId, staffData);
      await this.logRepository.updateLogAssignStaff(staffData.staffId, staffData);
      await this.fieldRepository.updateFieldAssignStaff(staffData.staffId, staffData);
      await this.equipmentRepository.updateEquipmentAssignStaff(staffData.staffId, staffData);

      const getVehicles = await this.vehicleRepository.getSelectedVehicles(result.assignVehicles);
      assignVehicleNames = getVehicles.map((vehicle) => vehicle.vehicleName);

      const getLogs = await this.logRepository.getSelectedLogs(result.assignLogs);
      assignLogNames = getLogs.map((log) => log.name);
      const getFields = await this.fieldRepository.getSelectedField(result.assignFields);
      assignFieldNames = getFields.map((field) => field.fieldName);

      const getEquipments = await this.equipmentRepository.getSelectedEquipment(result.assignEquipments);
      assignEquipmentNames = getEquipments.map((equ) => equ.equipmentName);

      const modifiedResult = {
        ...result.toObject(),
        assignVehicles: assignVehicleNames,
        assignLogs: assignLogNames,
        fields: assignFieldNames,
        assignEquipments: assignEquipmentNames,
      };
      return modifiedResult;
    } catch (e) {
      console.error("Service layer error: Failed to update staff member!", e);
      throw new Error("Failed to update staff member, Please try again.");
    }
  }

  async  deleteStaff(code: string) {
    try {
      const existingStaff = await this.staffRepository.findStaffById(code);
      console.log(existingStaff);
      if (!existingStaff) {
          console.warn(`Staff member ${code} not found, skipping delete.`);
          return { message: `Staff member ${code} not found, no deletion performed.` };
      }

      await Promise.all([
          this.vehicleRepository.deleteStaffInVehicle(code),
          this.logRepository.deleteStaffInLog(code),
          this.fieldRepository.deleteStaffInField(code),
          this.equipmentRepository.deleteStaffInEquipment(code),
      ]);
      
      await this.staffRepository.deleteStaff(code);
      return { message: `Staff member ${code} successfully deleted.` };
    } catch (e) {
      console.error("Service layer error: Failed to delete staff member!", e);
      throw new Error("Failed to delete staff member, Please try again.");
    }
  }
}
