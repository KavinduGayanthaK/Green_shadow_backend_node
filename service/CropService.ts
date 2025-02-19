import mongoose, { mongo } from "mongoose";
import { CropModel } from "../model/CropModel";
import { CropRepository } from "../repository/CropRepository";
import Crop from "../schema/CropSchema";

export class CropService {
    cropRepository = new CropRepository

    async addCrop(cropData: CropModel) {
        try {
            let cropFieldsId: mongoose.Types.ObjectId[] = [];
            let cropLogsId: mongoose.Types.ObjectId[] = [];

            const cropFieldsDocs = await Crop.find({
                code: {$in: cropData.cropFields},
            }).lean<{_id: mongoose.Types.ObjectId}[]>();
            cropFieldsId = cropFieldsDocs.map((field)=>field._id);

            const cropLogsDocs = await Crop.find({
                code: {$in: cropData.cropLogs},
            }).lean<{_id: mongoose.Types.ObjectId}[]>();
            cropLogsId = cropLogsDocs.map((log)=> log._id);

            const newCrop = new Crop({
                cropCode: cropData.cropCode,
                commonName: cropData.commonName,
                scientificName: cropData.scientificName,
                cropCategory: cropData.cropCategory,
                cropSeason: cropData.cropSeason,
                cropFields: cropFieldsId,
                cropLogs: cropLogsId,
                cropImage: cropData.cropImage
            });
            const savedCrop = await this.cropRepository.addCrop(newCrop);
            return { message: savedCrop };
        }catch (error) {
            console.error("Service layer error: Failed to save crop!");
            throw new Error("Failed to save crop. Please try again.");
        }
    }

    async getAllCrop() {
        try{
          const cropList = this.cropRepository.getAllCrop();
          const newList = cropList.map(crop=>({
            cropCode: crop.cropCode,
            commonName: crop.commonName,
            scientificName: crop.scientificName,
            cropCategory: crop.cropCategory,
            cropSeason: crop.cropSeason,
            cropFields: crop.cropFields.map((field)=> field.fieldCode), // Extract only IDs
            cropLogs: crop.cropLogs.map(log => log.logCode), // Extract only IDs
            cropImage: crop.cropImage
          }));
          return newList;
        }catch( error) {
          return error;
        }
      }
}