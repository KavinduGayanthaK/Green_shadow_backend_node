import mongoose from "mongoose";
import logger from "../logger/Logger";
import { CropModel } from "../model/CropModel";
import Field, { IField } from "../schema/FieldSchema";
import Crop from "../schema/CropSchema";
import { LogModel } from "../model/LogModel";
import Log from "../schema/LogSchema";
import { StaffModel } from "../model/StaffModel";
import Staff from "../schema/StaffSchema";

interface Field {
    fieldCode:string;
    fieldName:string;
    fieldLocation:string;
    extentSizeOfTheField:string;
    fieldCrops?:string[];
    fieldStaff?:string[];
    fieldLogs?:string[];
    fieldImage:string;
}

export class FieldRepository{
    async addField(fieldData:Field) {
        try{
            const newField = new Field(fieldData);
            const savedField = await newField.save();
            return savedField;
        }catch(error) {
            logger.error("Faild to save field");
            return {message: "Fiaild to save filed. Try again later"};
        }
    };

    async getAllField() {
        try{
            const fieldList = await Field.find();
            return fieldList;
        }catch (error) {
            logger.error("Failed to fetch field : ",error);
            return { message: "Failed to fetch field. Please try again.", error };
        }
    }

    async updateField(fieldCode: string, updateData: Partial<IField>) {
        try {
            const updateField = await Field.findOneAndUpdate(
                {fieldCode},
                {$set: updateData},
                {new: true}
            );

            return updateField;
        }catch(error) {
            console.error("Failed to update field:", error);
            throw error;
        }
    }

    async updateFieldAssignCrop(code: string, cropData:CropModel) {
        try {
            const cropDocs = await Crop.findOne({ code }).
            lean<{ _id: mongoose.Types.ObjectId }>();
            if (!cropDocs) {
                throw new Error(`Crop with code ${code} not found`);
            }
            const cropId = cropDocs._id;
    
            const existingFieldDocs = await Field.
            find({ fieldCrops: cropId }).
            lean<{ _id: mongoose.Types.ObjectId }[]>();

            const existingFieldIds = existingFieldDocs.map(field => field._id);
    
            const updatedFieldDocs = await Field.find({ code: { $in: cropData.cropFields } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
            const updatedFieldIds = updatedFieldDocs.map(field => field._id);
    
            const fieldToRemoveCrop = existingFieldIds.filter(id => !updatedFieldIds.includes(id));
    
            const fieldToAddCrop = updatedFieldIds.filter(id => !existingFieldIds.includes(id));
    
            if (fieldToRemoveCrop.length > 0) {
                await Field.updateMany(
                    { _id: { $in: fieldToRemoveCrop } },
                    { $pull: { fieldCrops: cropId } }
                );
            }
    
            if (fieldToAddCrop.length > 0) {
                await Field.updateMany(
                    { _id: { $in: fieldToAddCrop } },
                    { $addToSet: { fieldCrops: cropId } }
                );
            }
            return updatedFieldIds;
        } catch (e) {
            console.error("Error updating field assignCrops:", e);
            throw e;
        }
    }

    
    async updateFieldAssignStaff(code: string, staffData:StaffModel) {
        try {
            const staffDocs = await Staff.findOne({ code }).
            lean<{ _id: mongoose.Types.ObjectId }>();
            if (!staffDocs) {
                throw new Error(`Staff with code ${code} not found`);
            }
            const staffId = staffDocs._id;
    
            const existingFieldDocs = await Field.
            find({ fieldStaff: staffId }).
            lean<{ _id: mongoose.Types.ObjectId }[]>();

            const existingFieldIds = existingFieldDocs.map(field => field._id);
    
            const updatedFieldDocs = await Field.find({ code: { $in: staffData.fields } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
            const updatedFieldIds = updatedFieldDocs.map(field => field._id);
    
            const fieldToRemoveStaff = existingFieldIds.filter(id => !updatedFieldIds.includes(id));
    
            const fieldToAddStaff = updatedFieldIds.filter(id => !existingFieldIds.includes(id));
    
            if (fieldToRemoveStaff.length > 0) {
                await Field.updateMany(
                    { _id: { $in: fieldToRemoveStaff } },
                    { $pull: { fieldStaff: staffId } }
                );
            }
    
            if (fieldToAddStaff.length > 0) {
                await Field.updateMany(
                    { _id: { $in: fieldToAddStaff } },
                    { $addToSet: { fieldStaff: staffId } }
                );
            }
            return updatedFieldIds;
        } catch (e) {
            console.error("Error updating field assignCrops:", e);
            throw e;
        }
    }

    async updateFieldAssignLog(code: string, logData:LogModel) {
        try {
            const logDocs = await Log.findOne({ code }).
            lean<{ _id: mongoose.Types.ObjectId }>();
            if (!logDocs) {
                throw new Error(`Log with code ${code} not found`);
            }
            const logId = logDocs._id;
    
            const existingFieldDocs = await Field.
            find({ fieldLogs: logId }).
            lean<{ _id: mongoose.Types.ObjectId }[]>();

            const existingFieldIds = existingFieldDocs.map(field => field._id);
    
            const updatedFieldDocs = await Field.find({ code: { $in: logData.logFields } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
            const updatedFieldIds = updatedFieldDocs.map(field => field._id);
    
            const fieldToRemoveLog = existingFieldIds.filter(id => !updatedFieldIds.includes(id));
    
            const fieldToAddLog = updatedFieldIds.filter(id => !existingFieldIds.includes(id));
    
            if (fieldToRemoveLog.length > 0) {
                await Field.updateMany(
                    { _id: { $in: fieldToRemoveLog } },
                    { $pull: { fieldLogs: logId } }
                );
            }
    
            if (fieldToAddLog.length > 0) {
                await Field.updateMany(
                    { _id: { $in: fieldToAddLog } },
                    { $addToSet: {fieldLogs: logId } }
                );
            }
            return updatedFieldIds;
        } catch (e) {
            console.error("Error updating field assignLogs:", e);
            throw e;
        }
    }

    async deleteCropInField(code: string) {
        try {
            const cropDocs = await Crop.findOne({code}).lean<{_id: mongoose.Types.ObjectId} | null>();
            if (!cropDocs) {
                throw new Error(`Crop with code ${code} not found`)
            }

            const cropCode = cropDocs._id;
            return await Field.updateMany(
                {fieldCrops:cropCode},
                {$pull: {fieldCrops: cropCode}}
            );
        }catch(error) {
            console.log();
            
        }
    }

    async deleteLogInField(code: string) {
        try {
            const logDocs = await Log.findOne({code}).lean<{_id: mongoose.Types.ObjectId} | null>();
            if (!logDocs) {
                throw new Error(`Log with code ${code} not found`)
            }

            const logCode = logDocs._id;
            return await Field.updateMany(
                {fieldLogs:logCode},
                {$pull: {fieldLogs: logCode}}
            );
        }catch(error) {
            console.log();
            
        }
    }

    async deleteStaffInField(code: string) {
        try {
            const staffDocs = await Staff.findOne({code}).lean<{_id: mongoose.Types.ObjectId} | null>();
            if (!staffDocs) {
                throw new Error(`Log with code ${code} not found`)
            }

            const staffId = staffDocs._id;
            return await Field.updateMany(
                {fieldStaff:staffId},
                {$pull: {fieldStaff: staffId}}
            );
        }catch(error) {
            console.log();
            
        }
    }
    
    async getSelectedField(_ids: mongoose.Types.ObjectId[]) {
        try {
            return await Field.find({ _id: { $in: _ids } });
        } catch (e) {
            console.error("Error fetching selected field:", e);
            throw new Error("Failed to fetch selected field. Please try again.");
        }
    }

    async findFieldById(code: string) : Promise<IField | null> {
        return await Field.findOne({ code }).populate("fieldCrop").populate("fieldStaff").populate("fieldLog").exec();
    }


}