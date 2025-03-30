import mongoose from "mongoose";
import { FieldModel } from "../model/FieldModel";
import { FieldRepository } from "../repository/FieldRepository";
import Crop from "../schema/CropSchema";
import Staff from "../schema/StaffSchema";
import Log from "../schema/LogSchema";
import Field, { IField } from "../schema/FieldSchema";
import Equipment from "../schema/EquipmentSchema";
import { LogRepository } from "../repository/LogRepository";
import { EquipmentRepository } from "../repository/EquipmentRepository";
import { CropRepository } from "../repository/CropRepository";
import { StaffRepository } from "../repository/StaffRepository";

export class FieldService {
  fieldRepository = new FieldRepository();
  logRepository = new LogRepository();
  equipmentRepository = new EquipmentRepository();
  cropRepository = new CropRepository();
  staffRepository = new StaffRepository();

  async generateFieldCode(): Promise<string> {
    try {
      const lastField = await Field.findOne()
        .sort({ fieldCode: -1 })
        .lean<{ fieldCode: string } | null>();
      if (lastField?.fieldCode) {
        const lastIdNumber = parseInt(
          lastField.fieldCode.replace("FIELD-", ""),
          10
        );
        return `FIELD-${(lastIdNumber + 1).toString().padStart(3, "0")}`;
      }
      return "FIELD-001";
    } catch (error) {
      console.error("Error generating staff ID:", error);
      throw new Error("Failed to generate Staff ID.");
    }
  }

  async addField(fieldData: FieldModel) {
    try {
      let fieldCropCode: mongoose.Types.ObjectId[] = [];
      let fieldStaffId: mongoose.Types.ObjectId[] = [];
      let fieldLogCode: mongoose.Types.ObjectId[] = [];

      const fieldCropDocs = await Crop.find({
        code: { $in: fieldData.fieldCrops },
      }).lean<{ _id: mongoose.Types.ObjectId }[]>();
      fieldCropCode = fieldCropDocs.map((crop) => crop._id);

      const fieldStaffDocs = await Staff.find({
        id: { $in: fieldData.fieldStaff },
      }).lean<{ _id: mongoose.Types.ObjectId }[]>();
      fieldStaffId = fieldStaffDocs.map((staff) => staff._id);

      const fieldLogDocs = await Log.find({
        code: { $in: fieldData.fieldLogs },
      }).lean<{ _id: mongoose.Types.ObjectId }[]>();
      fieldLogCode = fieldLogDocs.map((log) => log._id);
      const newFd = await this.generateFieldCode()
      fieldData.fieldCode = newFd
      const newField = new Field({
        fieldCode: fieldData.fieldCode,
        fieldName: fieldData.fieldName,
        fieldLocation: fieldData.fieldLocation,
        extentSizeOfTheField: fieldData.extentSizeOfTheField,
        fieldCrops: fieldCropCode,
        fieldStaff: fieldStaffId,
        fieldLogs: fieldLogCode,
        fieldImage: fieldData.fieldImage,
      });

      const savedField = await this.fieldRepository.addField(newField);
      return { message: savedField };
    } catch (error) {
      console.error("Service layer error: Failed to save Field!");
      throw new Error("Failed to save Field. Please try again.");
    }
  }

  async getAllFields() {
    try {
      const fieldList =await  this.fieldRepository.getAllField();
      return fieldList;
    } catch (error) {
      return error;
    }
  }

  async updateField(id: string, fieldData: FieldModel) {
    try {
      const existingField = await this.fieldRepository.findFieldById(id);
      if (!existingField) {
        throw new Error("Field not found");
      }

      let updatefieldCropsId: mongoose.Types.ObjectId[] = [];
      let updatefieldStaffId: mongoose.Types.ObjectId[] = [];
      let updatefieldEquipmentsId: mongoose.Types.ObjectId[] = [];
      let updatefieldLogsId: mongoose.Types.ObjectId[] = [];
      let updatefieldCropsName: string[] = [];
      let updatefieldStaffName: string[] = [];
      let updatefieldEquipmentsName: string[] = [];
      let updatefieldLogsName: string[] = [];

      if (
        (fieldData.fieldCrops && Array.isArray(fieldData.fieldCrops)) ||
        (fieldData.fieldStaff && Array.isArray(fieldData.fieldStaff)) ||
        (fieldData.fieldEquipments &&
          Array.isArray(fieldData.fieldEquipments)) ||
        (fieldData.fieldLogs && Array.isArray(fieldData.fieldLogs))
      ) {
        const fieldCropDoc = await Crop.find({
          cropCode: { $in: fieldData.fieldCrops },
        });
        updatefieldCropsId = fieldCropDoc.map(
          (crop) => crop._id as mongoose.Types.ObjectId
        );

        const fielStaffDoc = await Staff.find({
          staffId: { $in: fieldData.fieldStaff },
        });
        updatefieldStaffId = fielStaffDoc.map(
          (staff) => staff._id as mongoose.Types.ObjectId
        );

        const fieldEquipmentDoc = await Equipment.find({
          equipmentId: { $in: fieldData.fieldEquipments },
        });
        updatefieldEquipmentsId = fieldEquipmentDoc.map(
          (equ) => equ._id as mongoose.Types.ObjectId
        );

        const fieldLogDoc = await Log.find({
          logCode: { $in: fieldData.fieldLogs },
        });
        updatefieldLogsId = fieldLogDoc.map(
          (log) => log._id as mongoose.Types.ObjectId
        );
      }

      const updateData: Partial<IField> = {
        fieldCode: fieldData.fieldCode,
        fieldName: fieldData.fieldName,
        fieldLocation: fieldData.fieldLocation,
        extentSizeOfTheField: fieldData.extentSizeOfTheField,
        fieldCrops: updatefieldCropsId,
        fieldStaff: updatefieldStaffId,
        fieldEquipments: updatefieldEquipmentsId,
        fieldLogs: updatefieldLogsId,
        fieldImage: fieldData.fieldImage,
      };

      const result = await this.fieldRepository.updateField(
        fieldData.fieldCode,
        updateData
      );
      await this.cropRepository.updateCropAssignField(
        fieldData.fieldCode,
        fieldData
      );
      await this.staffRepository.updateFieldsAssignStaff(
        fieldData.fieldCode,
        fieldData
      );
      await this.equipmentRepository.updateEquipmentAssignField(
        fieldData.fieldCode,
        fieldData
      );
      await this.logRepository.updateLogAssignField(
        fieldData.fieldCode,
        fieldData
      );

      const getEquipments = await this.equipmentRepository.getSelectedEquipment(
        result.fieldEquipments
      );
      updatefieldEquipmentsName = getEquipments.map((eq) => eq.equipmentName);

      const getCrops = await this.cropRepository.getSelectedCrop(
        result.fieldCrops
      );
      updatefieldCropsName = getCrops.map((crop) => crop.commonName);

      const getStaff = await this.staffRepository.getSelectedStaff(
        result.fieldStaff
      );
      updatefieldStaffName = getStaff.map((staff) => staff.firstName);

      const getLogs = await this.logRepository.getSelectedLogs(
        result.fieldLogs
      );
      updatefieldLogsName = getLogs.map((log) => log.logCode);

      const modifiedResult = {
        ...result.toObject(),
        fieldCrops: updatefieldCropsName,
        fieldStaff: updatefieldStaffName,
        fieldEquipments: updatefieldEquipmentsName,
        fieldLogs: updatefieldLogsName,
      };

      return modifiedResult;
    } catch (e) {
      console.error("Service layer error: Failed to update field!", e);
      throw new Error("Failed to update field, Please try again.");
    }
  }

  async deleteField(code: string) {
    try {
        const excitingField = await this.fieldRepository.findFieldById(code);
        if (!excitingField) {
            throw new Error(`Field-${code} is not found`);
        }
        const deleteFieldIdsOfStaff = await this.staffRepository.deleteFieldInStaff(code);
        const deleteFieldIdsOfLog = await this.logRepository.deleteFieldInLog(code);
        const deleteFieldIdsOfCrop = await this.cropRepository.deleteFieldInCrop(code);
        const deleteFieldIdsOfEquipment = await this.equipmentRepository.deleteFieldInEquipment(code);
        return await this.fieldRepository.deleteField(code);
    } catch (e) {
        console.error("Service layer error: Failed to delete staff member!", e);
        throw new Error("Failed to delete staff member, Please try again.");
    }
}


}
