import mongoose from "mongoose";
import logger from "../logger/Logger";
import { StaffModel } from "../model/StaffModel";
import Equipment, { IEquipment } from "../schema/EquipmentSchema";
import Staff from "../schema/StaffSchema";
import Field from "../schema/FieldSchema";
import { FieldModel } from "../model/FieldModel";


interface Equipment {
    equipmentId:string;
    equipmentName:string;
    equipmentType:string;
    totalCount:number;
    status:string;
    equipmentFields?:string[];
    equipmentStaffMembers?:string[];
}

export class EquipmentRepository{
    async addEquipment(equipmentData:Equipment) {
        try{
            const newEquipment = new Equipment(equipmentData);
            const savedEquipment = await newEquipment.save();
            return newEquipment;
        }catch(error) {
            logger.error("Faild to save equipment");
            return {message: "Fiaild to save equipment. Try again later"};
        }
    }

    async getAllEquipment() {
        try{
            const equipmentList = await Equipment.find();
            return equipmentList;
        }catch (error) {
            logger.error("Failed to fetch equipment : ",error);
            return { message: "Failed to fetch equipment. Please try again.", error };
        }
    }

    async updateEquipment(equipmentId: string, updateData: Partial<IEquipment>) {
        try {
            const updateEquipment = await Equipment.findOneAndUpdate(
                {equipmentId},
                {$set: updateData},
                {new: true}
            );

            return updateEquipment;
        }catch(error) {
            console.error("Failed to update equipment:", error);
            throw error;
        }
    }

    async updateEquipmentAssignStaff(code: string, staffData:StaffModel) {
        try {
            const staffDocs = await Staff.findOne({ staffId:code }).
            lean<{ _id: mongoose.Types.ObjectId }>();
            if (!staffDocs) {
                throw new Error(`Staff with code ${code} not found`);
            }
            const staffId = staffDocs._id;
    
            const existingEquipmentDocs = await Equipment.
            find({ equipmentStaffMember: staffId }).
            lean<{ _id: mongoose.Types.ObjectId }[]>();

            const existingEquipmentIds = existingEquipmentDocs.map(equipment => equipment._id);
    
            const updatedEquipmentDocs = await Equipment.find({ code: { $in: staffData.equipments } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
            const updatedEquipmentIds = updatedEquipmentDocs.map(equipment => equipment._id);
    
            const equipmentToRemoveStaff = existingEquipmentIds.filter(id => !updatedEquipmentIds.includes(id));
    
            const equipmentToAddStaff = updatedEquipmentIds.filter(id => !existingEquipmentIds.includes(id));
    
            if (equipmentToRemoveStaff.length > 0) {
                await Equipment.updateMany(
                    { _id: { $in: equipmentToRemoveStaff } },
                    { $pull: { equipmentStaffMember: staffId } }
                );
            }
    
            if (equipmentToAddStaff.length > 0) {
                await Equipment.updateMany(
                    { _id: { $in: equipmentToAddStaff } },
                    { $addToSet: { equipmentStaffMember: staffId } }
                );
            }
            return updatedEquipmentIds;
        } catch (e) {
            console.error("Error updating equipment assignStaff:", e);
            throw e;
        }
    }

    async updateEquipmentAssignField(code: string, fieldData:FieldModel) {
        try {
            const fieldDocs = await Field.findOne({ fieldCode:code }).
            lean<{ _id: mongoose.Types.ObjectId }>();
            if (!fieldDocs) {
                throw new Error(`Field with code ${code} not found`);
            }
            const fieldId = fieldDocs._id;
    
            const existingEquipmentDocs = await Equipment.
            find({ logFields: fieldId }).
            lean<{ _id: mongoose.Types.ObjectId }[]>();

            const existingEquipmentIds = existingEquipmentDocs.map(equipment => equipment._id);
    
            const updatedEquipmentDocs = await Equipment.find({ code: { $in: fieldData.fieldLogs } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
            const updatedEquipmentIds = updatedEquipmentDocs.map(equipment => equipment._id);
    
            const equipmentToRemoveField = existingEquipmentIds.filter(id => !updatedEquipmentIds.includes(id));
    
            const equipmentToAddField = updatedEquipmentIds.filter(id => !existingEquipmentIds.includes(id));
    
            if (equipmentToRemoveField.length > 0) {
                await Equipment.updateMany(
                    { _id: { $in: equipmentToRemoveField } },
                    { $pull: { equipmentFields: fieldId } }
                );
            }
    
            if (equipmentToAddField.length > 0) {
                await Equipment.updateMany(
                    { _id: { $in: equipmentToAddField } },
                    { $addToSet: { equipmentFields: fieldId } }
                );
            }
            return updatedEquipmentIds;
        } catch (e) {
            console.error("Error updating equipment assignFields:", e);
            throw e;
        }
    }

    async getSelectedEquipment(_ids: mongoose.Types.ObjectId[]) {
        try {
            return await Equipment.find({ _id: { $in: _ids } });
        } catch (e) {
            console.error("Error fetching selected equipments:", e);
            throw new Error("Failed to fetch selected equipments. Please try again.");
        }
    }

    async deleteStaffInEquipment(code: string) {
        try {
            const staffDoc = await Staff.findOne({ staffId:code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
            if (!staffDoc) {
                throw new Error(`Staff with code ${code} not found`);
            }
            const staffId = staffDoc._id;
            return await Equipment.updateMany(
                { equipmentStaffMember: staffId },
                { $pull: { equipmentStaffMember: staffId } }
            );
        } catch (e) {
            console.error("Error removing staff from equipment:", e);
            throw e;
        }
    }

    async deleteFieldInEquipment(code: string) {
        try {
            const FieldDoc = await Field.findOne({ fieldCode:code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
            if (!FieldDoc) {
                throw new Error(`Field with code ${code} not found`);
            }
            const fieldId = FieldDoc._id;
            return await Equipment.updateMany(
                { equipmentFields: fieldId },
                { $pull: { equipmentFields: fieldId } }
            );
        } catch (e) {
            console.error("Error removing crop from equipment:", e);
            throw e;
        }
    }

    async findEquipmentById(code: string) : Promise<IEquipment | null> {
        return await Equipment.findOne({ equipmentId:code }).populate("equipmentStaffMember").populate("equipmentField").exec();
    }


}