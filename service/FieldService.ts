import mongoose from "mongoose";
import { FieldModel } from "../model/FieldModel";
import { FieldRepository } from "../repository/FieldRepository";
import Crop from "../schema/CropSchema";
import Staff from "../schema/StaffSchema";
import Log from "../schema/LogSchema";
import Field from "../schema/FieldSchema";

export class FieldService {
  fieldRepository = new FieldRepository();
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
}
