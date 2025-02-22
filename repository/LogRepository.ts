import mongoose from "mongoose";
import logger from "../logger/Logger";
import Log, { ILog } from "../schema/LogSchema";
import Crop from "../schema/CropSchema";
import { CropModel } from "../model/CropModel";
import { FieldModel } from "../model/FieldModel";
import Field from "../schema/FieldSchema";
import { StaffModel } from "../model/StaffModel";
import Staff from "../schema/StaffSchema";



interface Log {
    logCode: string;
    logDate: string | null;
    logDetails: string;
    logType: string;
    logImage: string;
    logFields: string[];
    logCrops?: string[];
    logStaff?: string[];
}

export class LogRepository{
    async addLog(logData: Log) {
        try{
            const newLog = new Log(logData);
            const savedLog = await newLog.save();
            return savedLog;
        }catch(error) {
            logger.error("Faild to save log");
            return {message: "Fiaild to save log. Try again later"};
        }
    }

    async getAllLog() {
        try{
            const logList = await Log.find();
            return logList;
        }catch (error) {
            logger.error("Failed to fetch log : ",error);
            return { message: "Failed to fetch log. Please try again.", error };
        }
    }

    async updateLog(logCode: string, updateData: Partial<ILog>) {
        try {
            const updateLog = await Log.findOneAndUpdate(
                {logCode},
                {$set: updateData},
                {new: true}
            );

            return updateLog;
        }catch(error) {
            console.error("Failed to update log:", error);
            throw error;
        }
    }

    async updateLogAssignCrop(code: string, cropData:CropModel) {
        try {
            const cropDocs = await Crop.findOne({ code }).
            lean<{ _id: mongoose.Types.ObjectId }>();
            if (!cropDocs) {
                throw new Error(`Crop with code ${code} not found`);
            }
            const cropId = cropDocs._id;
    
            const existingLogDocs = await Log.
            find({ logCrops: cropId }).
            lean<{ _id: mongoose.Types.ObjectId }[]>();

            const existingLogIds = existingLogDocs.map(log => log._id);
    
            const updatedLogDocs = await Log.find({ code: { $in: cropData.cropLogs } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
            const updatedLogIds = updatedLogDocs.map(log => log._id);
    
            const logToRemoveCrop = existingLogIds.filter(id => !updatedLogIds.includes(id));
    
            const logToAddCrop = updatedLogIds.filter(id => !existingLogIds.includes(id));
    
            if (logToRemoveCrop.length > 0) {
                await Log.updateMany(
                    { _id: { $in: logToRemoveCrop } },
                    { $pull: { logCrops: cropId } }
                );
            }
    
            if (logToAddCrop.length > 0) {
                await Log.updateMany(
                    { _id: { $in: logToAddCrop } },
                    { $addToSet: { logCrops: cropId } }
                );
            }
            return updatedLogIds;
        } catch (e) {
            console.error("Error updating log assignCrops:", e);
            throw e;
        }
    }

    async updateLogAssignField(code: string, fieldData:FieldModel) {
        try {
            const fieldDocs = await Field.findOne({ code }).
            lean<{ _id: mongoose.Types.ObjectId }>();
            if (!fieldDocs) {
                throw new Error(`Field with code ${code} not found`);
            }
            const fieldId = fieldDocs._id;
    
            const existingLogDocs = await Log.
            find({ logFields: fieldId }).
            lean<{ _id: mongoose.Types.ObjectId }[]>();

            const existingLogIds = existingLogDocs.map(log => log._id);
    
            const updatedLogDocs = await Log.find({ code: { $in: fieldData.fieldLogs } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
            const updatedLogIds = updatedLogDocs.map(log => log._id);
    
            const logToRemoveField = existingLogIds.filter(id => !updatedLogIds.includes(id));
    
            const logToAddField = updatedLogIds.filter(id => !existingLogIds.includes(id));
    
            if (logToRemoveField.length > 0) {
                await Log.updateMany(
                    { _id: { $in: logToRemoveField } },
                    { $pull: { logCrops: fieldId } }
                );
            }
    
            if (logToAddField.length > 0) {
                await Log.updateMany(
                    { _id: { $in: logToAddField } },
                    { $addToSet: { logCrops: fieldId } }
                );
            }
            return updatedLogIds;
        } catch (e) {
            console.error("Error updating log assignFields:", e);
            throw e;
        }
    }

    async updateLogAssignStaff(code: string, staffData:StaffModel) {
        try {
            const staffDocs = await Staff.findOne({ code }).
            lean<{ _id: mongoose.Types.ObjectId }>();
            if (!staffDocs) {
                throw new Error(`Staff with code ${code} not found`);
            }
            const staffId = staffDocs._id;
    
            const existingLogDocs = await Log.
            find({ logStaff: staffId }).
            lean<{ _id: mongoose.Types.ObjectId }[]>();

            const existingLogIds = existingLogDocs.map(log => log._id);
    
            const updatedLogDocs = await Log.find({ code: { $in: staffData.logs } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
            const updatedLogIds = updatedLogDocs.map(log => log._id);
    
            const logToRemoveStaff = existingLogIds.filter(id => !updatedLogIds.includes(id));
    
            const logToAddStaff = updatedLogIds.filter(id => !existingLogIds.includes(id));
    
            if (logToRemoveStaff.length > 0) {
                await Log.updateMany(
                    { _id: { $in: logToRemoveStaff } },
                    { $pull: { logStaff: staffId } }
                );
            }
    
            if (logToAddStaff.length > 0) {
                await Log.updateMany(
                    { _id: { $in: logToAddStaff } },
                    { $addToSet: { logStaff: staffId } }
                );
            }
            return updatedLogIds;
        } catch (e) {
            console.error("Error updating log assignStaff:", e);
            throw e;
        }
    }

    async getSelectedLogs(_ids: mongoose.Types.ObjectId[]) {
        try {
            return await Log.find({ _id: { $in: _ids } });
        } catch (e) {
            console.error("Error fetching selected logs:", e);
            throw new Error("Failed to fetch selected logs. Please try again.");
        }
    }

    async deleteStaffInLog(code: string) {
        try {
            const staffDoc = await Staff.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
            if (!staffDoc) {
                throw new Error(`Staff with code ${code} not found`);
            }
            const staffId = staffDoc._id;
            return await Log.updateMany(
                { logStaff: staffId },
                { $pull: { logStaff: staffId } }
            );
        } catch (e) {
            console.error("Error removing staff from log:", e);
            throw e;
        }
    }

    async deleteCropInLog(code: string) {
        try {
            const cropDoc = await Crop.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
            if (!cropDoc) {
                throw new Error(`Crop with code ${code} not found`);
            }
            const cropId = cropDoc._id;
            return await Log.updateMany(
                { logCrops: cropId },
                { $pull: { logCrops: cropId } }
            );
        } catch (e) {
            console.error("Error removing crop from log:", e);
            throw e;
        }
    }

    async deleteFieldInLog(code: string) {
        try {
            const FieldDoc = await Field.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
            if (!FieldDoc) {
                throw new Error(`Field with code ${code} not found`);
            }
            const fieldId = FieldDoc._id;
            return await Log.updateMany(
                { logFields: fieldId },
                { $pull: { logFields: fieldId } }
            );
        } catch (e) {
            console.error("Error removing crop from log:", e);
            throw e;
        }
    }

    async findLogById(code: string) : Promise<ILog | null> {
        return await Log.findOne({ code }).populate("logStaff").populate("logCrop").populate("logField").exec();
    }

}