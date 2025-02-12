import mongoose from "mongoose";
import { EquipmentModel } from "../model/EquipmentModel";
import { EquipmentRepository } from "../repository/EquipmentRepository";
import Equipment from "../schema/EquipmentSchema";

export class EquipmentService {
    equipmentRepository = new EquipmentRepository

    async addEquipment(equipmentData: EquipmentModel) {
        try {
            let equipmentFieldsId: mongoose.Types.ObjectId[] = [];
            let equipmentStaffId: mongoose.Types.ObjectId[] = [];

            const equipmentFieldsDocs = await Equipment.find({
                code: {$in: equipmentData.equipmentFields},
            }).lean<{_id: mongoose.Types.ObjectId}[]>();
            equipmentFieldsId = equipmentFieldsDocs.map((field)=>field._id);

            const equipmentStaffDocs = await Equipment.find({
                code: {$in: equipmentData.equipmentStaffMembers},
            }).lean<{_id: mongoose.Types.ObjectId}[]>();
            equipmentStaffId = equipmentStaffDocs.map((staff)=> staff._id);

            const newEquipment = new Equipment({
                equipmentId: equipmentData.equipmentId,
                equipmentName: equipmentData.equipmentName,
                equipmentType: equipmentData.equipmentType,
                totalCount: equipmentData.totalCount,
                status: equipmentData.status,
                equipmentFields: equipmentFieldsId,
                equipmentStaffMembers: equipmentStaffId
            });
            const savedEquipment = await this.equipmentRepository.addEquipment(newEquipment);
            return { message: savedEquipment};
        }catch (error) {
            console.error("Service layer error: Failed to save Equipment!");
            throw new Error("Failed to save Equipment. Please try again.");
        }
    }
}