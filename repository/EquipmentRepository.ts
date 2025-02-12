import logger from "../logger/Logger";
import Equipment from "../schema/EquipmentSchema";


interface Equipment {
    equipmentId:string;
    equipmentName:string;
    equipmentType:string;
    totalCount:number;
    status:string;
    equipmentFields:string[];
    equipmentStaffMembers:string[];
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
}