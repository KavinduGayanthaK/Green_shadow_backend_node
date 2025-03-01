import mongoose from "mongoose";
import { EquipmentModel } from "../model/EquipmentModel";
import { EquipmentRepository } from "../repository/EquipmentRepository";
import Equipment from "../schema/EquipmentSchema";

export class EquipmentService {
    equipmentRepository = new EquipmentRepository

    async generateCropCode(): Promise<string> {
        try {
          const lastEquipment = await Equipment.findOne()
            .sort({ equipmentId: -1 })
            .lean<{ equipmentId: string } | null>();
          if (lastEquipment?.equipmentId) {
            const lastIdNumber = parseInt(
                lastEquipment.equipmentId.replace("EQUIPMENT-", ""),
              10
            );
            return `EQUIPMENT-${(lastIdNumber + 1).toString().padStart(3, "0")}`;
          }
          return "EQUIPMENT-001";
        } catch (error) {
          console.error("Error generating staff ID:", error);
          throw new Error("Failed to generate Staff ID.");
        }
      }

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
            
            const newEqId = await this.generateCropCode()
            equipmentData.equipmentId = newEqId
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
    };

    async getAllEquipment() {
        try{
          const equipmentList = this.equipmentRepository.getAllEquipment();
          return equipmentList
        }catch( error) {
          return error;
        }
      };
}