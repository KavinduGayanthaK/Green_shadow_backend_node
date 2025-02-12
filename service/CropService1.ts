import {CropModel} from "../models/crop-model";
import {deleteCrop, findCropById, getAllCrops, saveCrop, updateCrop} from "../repository/crop-repository";
import mongoose from "mongoose";
import Field from "../schema/field";
import Log from "../schema/log";
import Crop, {ICrop, SeasonType} from "../schema/crop";
import {deleteCropInField, updateFieldAssignCrop} from "../repository/field-repository";
import {deleteCropInLog, updateLogAssignCrop} from "../repository/log-repository";

export async function saveCropService(cropData: CropModel) {
    try {
        let assignFieldIds : mongoose.Types.ObjectId[] = [];
        let assignLogIds : mongoose.Types.ObjectId[] = [];

        const fieldDocs = await Field.find( { code: { $in: cropData.assignFields }}).lean<{ _id: mongoose.Types.ObjectId}[]>();
        assignFieldIds = fieldDocs.map((field) => field._id);

        const logDocs = await Log.find({ code: { $in: cropData.assignLogs }}).lean<{ _id: mongoose.Types.ObjectId}[]>();
        assignLogIds = logDocs.map((log) => log._id);

        const newCrop = new Crop({
            code: cropData.code,
            name: cropData.name,
            scientificName: cropData.scientificName,
            category: cropData.category,
            season: cropData.season,
            image: cropData.image,
            assignFields: assignFieldIds,
            assignLogs: assignLogIds
        });
        const result = await saveCrop(newCrop);
        return { message: result };
    } catch (e) {
        console.error("Service layer error: Failed to save crops!");
        throw new Error("Failed to save crops. Please try again.");
    }
}

export async function updateCropService(cropData: CropModel) {
    try {
        const excitingCrop = await findCropById(cropData.code);
        if (!excitingCrop) {
            throw new Error("Crop not found!");
        }

        let updatedFieldIds : mongoose.Types.ObjectId[] = [];
        let updatedLogIds : mongoose.Types.ObjectId[] = [];
        if (cropData.assignFields && Array.isArray(cropData.assignFields) || cropData.assignLogs && Array.isArray(cropData.assignLogs)) {
            const fieldDocs = await Field.find({ code: { $in: cropData.assignFields }});
            updatedFieldIds = fieldDocs.map((field) => field._id as mongoose.Types.ObjectId);

            const logDocs = await Log.find({ code: { $in: cropData.assignLogs }});
            updatedLogIds = logDocs.map((log) => log._id as mongoose.Types.ObjectId);
        }

        const updatedData: Partial<ICrop> = {
            name: cropData.name,
            scientificName: cropData.scientificName,
            category: cropData.category,
            season: cropData.season as SeasonType,
            image: cropData.image,
            assignFields: updatedFieldIds,
            assignLogs: updatedLogIds
        }

        const updatedCropOfField = await updateFieldAssignCrop(cropData.code, cropData);
        const updatedCropOfLog = await updateLogAssignCrop(cropData.code, cropData);
        return await updateCrop(cropData.code, updatedData);
    } catch (e) {
        console.error("Service layer error: Failed to update crop!", e);
        throw new Error("Failed to update crop, Please try again.");
    }
}

export async function deleteCropService(code: string) {
    try {
        const excitingCrop = await findCropById(code);
        if (!excitingCrop) {
            throw new Error(Crop-${code} is not found);
        }
        const deleteCropIdsOfField = await deleteCropInField(code);
        const deleteCropIdsOfLog = await deleteCropInLog(code);
        return await deleteCrop(code);
    } catch (e) {
        console.error("Service layer error: Failed to delete crop!", e);
        throw new Error("Failed to delete crop, Please try again.");
    }
}

export async function getAllCropService() {
    try {
        return await getAllCrops();
    } catch (e) {
        console.error("Service layer error: Failed to get crop data!", e);
        throw new Error("Failed to get crop data, Please try again.");
    }
}