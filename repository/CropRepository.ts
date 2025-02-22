import mongoose from "mongoose";
import logger from "../logger/Logger";
import { FieldModel } from "../model/FieldModel";
import Crop, { ICrop } from "../schema/CropSchema";
import Field from "../schema/FieldSchema";
import { constants } from "fs/promises";
import { LogModel } from "../model/LogModel";
import { log } from "console";
import Log from "../schema/LogSchema";

interface Crop {
  cropCode: string;
  commonName: string;
  scientificName: string;
  cropCategory: string;
  cropSeason: string;
  cropFields?: string[];
  cropLogs?: string[];
  cropImage: string;
}

export class CropRepository {
  async addCrop(cropData: Crop) {
    try {
      const newCrop = new Crop(cropData);
      const savedCrop = await newCrop.save();
      return savedCrop;
    } catch (error) {
      logger.error("Faild to save crop");
      return { message: "Fiaild to save crop. Try again later" };
    }
  }
  async getAllCrop() {
    try {
      const cropList = await Crop.find();
      return cropList;
    } catch (error) {
      logger.error("Failed to fetch crop : ", error);
      return { message: "Failed to fetch crop. Please try again.", error };
    }
  }

  async updatCrop(cropCode: string, updateData: Partial<ICrop>) {
    try {
      const updateCrop = await Crop.findOneAndUpdate(
        { cropCode },
        { $set: updateData },
        { new: true }
      );
      return updateCrop;
    } catch (error) {
      console.log("Failed to update crop : ", error);
      throw error;
    }
  }

  async updateCropAssignField(code: string, fieldDate: FieldModel) {
    try {
      const fieldDocs = await Field.find({ code }).lean<{
        _id: mongoose.Types.ObjectId;
      } | null>();

      if (!fieldDocs) {
        throw new Error(`Field with code ${code} not found`);
      }

      const fieldCode = fieldDocs._id;

      const existingCropDocs = await Crop.find({ cropFields: fieldCode }).lean<
        { _id: mongoose.Types.ObjectId }[]
      >();

      const existingCropCodes = existingCropDocs.map((crop) => crop._id);

      const updateCropDocs = await Crop.find({
        code: { $in: fieldDate.fieldCrops },
      }).lean<{ _id: mongoose.Types.ObjectId }[]>();

      const updateCropCodes = updateCropDocs.map((crop) => crop._id);

      const cropToRemoveField = existingCropCodes.filter(
        (code) => !updateCropCodes.includes(code)
      );

      const cropToAddField = updateCropCodes.filter(
        (code) => !existingCropCodes.includes(code)
      );

      if (cropToRemoveField.length > 0) {
        await Crop.updateMany(
          { _id: { $in: cropToRemoveField } },
          { $pull: { cropFields: fieldCode } }
        );
      }

      if (cropToAddField.length > 0) {
        await Crop.updateMany(
          { _id: { $in: cropToAddField } },
          { $addToSet: { cropFields: fieldCode } }
        );
      }
      return updateCropCodes;
    } catch (error) {
      console.error("Error updating crop assignFields:", error);
      throw error;
    }
  }

  async updateCropAssignLog(code: string, logData: LogModel) {
    try {
      const logDocs = await Log.findOne({ code }).lean<{
        _id: mongoose.Types.ObjectId;
      }>();

      if (!logDocs) {
        throw new Error(`Log with code ${code} not found`);
      }
      const logId = logDocs._id;

      const existingCropDocs = await Crop.find({ cropLogs: logId }).lean<
        { _id: mongoose.Types.ObjectId }[]
      >();

      const existingCropIds = existingCropDocs.map((crop) => crop._id);

      const updateCropDocs = await Crop.find({
        code: { $in: logData.logStaff },
      }).lean<{ _id: mongoose.Types.ObjectId }[]>();
      const updateCropIds = updateCropDocs.map((crop) => crop._id);

      const cropToRemoveLog = existingCropIds.filter(
        (id) => !updateCropIds.includes(id)
      );

      const cropToAddLog = updateCropIds.filter(
        (id) => !existingCropIds.includes(id)
      );

      if (cropToRemoveLog.length > 0) {
        await Crop.updateMany(
          { _id: { $in: cropToRemoveLog } },
          { $pull: { cropLogs: logId } }
        );
      }

      if (cropToAddLog.length > 0) {
        await Crop.updateMany(
          { _id: { $in: cropToAddLog } },
          { $addToSet: { cropLogs: logId } }
        );
      }
      return updateCropIds;
    } catch (e) {
      console.error("Error updating crop assignLogs:", e);
      throw e;
    }
  }

  async deleteFieldInCrop(code: string) {
    try {
      const cropDocs = await Crop.findOne({ code }).lean<{
        _id: mongoose.Types.ObjectId;
      } | null>();
      if (!cropDocs) {
        throw new Error(`Crop with code ${code} not found`);
      }

      const cropCode = cropDocs._id;
      return await Crop.updateMany(
        { cropFields: cropCode },
        { $pull: { cropFields: cropCode } }
      );
    } catch (error) {
      console.log();
    }
  }

  async deleteLogInCrop(code: string) {
    try {
      const logDocs = await Log.findOne({ code }).lean<{
        _id: mongoose.Types.ObjectId;
      } | null>();
      if (!logDocs) {
        throw new Error(`Log with code ${code} not found`);
      }

      const logCode = logDocs._id;
      return await Crop.updateMany(
        { cropLogs: logCode },
        { $pull: { cropLogs: logCode } }
      );
    } catch (error) {
      console.log();
    }
  }

  async getSelectedCrop(_ids: mongoose.Types.ObjectId[]) {
    try {
        return await Crop.find({ _id: { $in: _ids } });
    } catch (e) {
        console.error("Error fetching selected crop:", e);
        throw new Error("Failed to fetch selected crop. Please try again.");
    }
  }

  async findCropById(code: string) : Promise<ICrop | null> {
      return await Crop.findOne({ code }).populate("cropFields").populate("cropLogs").exec();
  }
}
