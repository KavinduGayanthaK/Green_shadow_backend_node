import mongoose from "mongoose";
import { CropModel } from "../model/CropModel";
import { CropRepository } from "../repository/CropRepository";
import Crop from "../schema/CropSchema";
import { LogRepository } from "../repository/LogRepository";
import { EquipmentRepository } from "../repository/EquipmentRepository";
import { FieldRepository } from "../repository/FieldRepository";

export class CropService {
  cropRepository = new CropRepository();
  logRepository = new LogRepository();
  equipmentRepository = new EquipmentRepository();
  fieldRepository = new FieldRepository();

  async generateCropCode(): Promise<string> {
    try {
      const lastCrop = await Crop.findOne()
        .sort({ cropCode: -1 })
        .lean<{ cropCode: string } | null>();
      if (lastCrop?.cropCode) {
        const lastIdNumber = parseInt(
          lastCrop.cropCode.replace("CROP-", ""),
          10
        );
        return `CROP-${(lastIdNumber + 1).toString().padStart(3, "0")}`;
      }
      return "CROP-001";
    } catch (error) {
      console.error("Error generating staff ID:", error);
      throw new Error("Failed to generate Staff ID.");
    }
  }

  async addCrop(cropData: CropModel) {
    try {
      let cropFieldsId: mongoose.Types.ObjectId[] = [];
      let cropLogsId: mongoose.Types.ObjectId[] = [];

      const cropFieldsDocs = await Crop.find({
        code: { $in: cropData.cropFields },
      }).lean<{ _id: mongoose.Types.ObjectId }[]>();
      cropFieldsId = cropFieldsDocs.map((field) => field._id);

      const cropLogsDocs = await Crop.find({
        code: { $in: cropData.cropLogs },
      }).lean<{ _id: mongoose.Types.ObjectId }[]>();
      cropLogsId = cropLogsDocs.map((log) => log._id);

      
      const newCrop = new Crop({
        cropCode: cropData.cropCode,
        commonName: cropData.commonName,
        scientificName: cropData.scientificName,
        cropCategory: cropData.cropCategory,
        cropSeason: cropData.cropSeason,
        cropFields: cropFieldsId,
        cropLogs: cropLogsId,
        cropImage: cropData.cropImage,
      });
      const savedCrop = await this.cropRepository.addCrop(newCrop);
      return { message: savedCrop };
    } catch (error) {
      console.error("Service layer error: Failed to save crop!");
      throw new Error("Failed to save crop. Please try again.");
    }
  }

  async getAllCrop() {
    try {
      const cropList = await this.cropRepository.getAllCrop();
      return cropList;
    } catch (error) {
      return error;
    }
  }

  async deleteCrop(code: string) {
    try {
      const excitingCrop = await this.cropRepository.findCropById(code);
      if (!excitingCrop) {
        throw new Error(`Crop-${code} is not found`);
      }

      await this.logRepository.deleteCropInLog(code);
      await this.fieldRepository.deleteCropInField(code);

      return await this.cropRepository.deleteCrop(code);
    } catch (e) {
      console.error("Service layer error: Failed to delete staff member!", e);
      throw new Error("Failed to delete staff member, Please try again.");
    }
  }
}
