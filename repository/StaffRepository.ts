import logger from "../logger/Logger";
import Staff from "../schema/StaffSchema";

interface Staff {
    staffId: string;
    firstName: string;
    lastName: string;
    designation: string;
    gender: string;
    joinedDate: string | null;
    dateOfBirth: string | null;
    buildingNumber: string;
    lane: string;
    city: string;
    state: string;
    postalCode: string;
    contactNumber: string;
    email: string;
    role: string;
    fields: string[];
    vehicles: string[];
    equipments: string[];
    logs:string[];
}

export class StaffRepository {
    async addStaff(staffData: Staff) {
        try {
            const newStaf = new Staff(staffData);
            const savedStaff = await newStaf.save();
            return savedStaff; 
        } catch (error) {
            logger.error("Failed to save staff.");
            return { message: "Failed to save staff. Please try again.", error };
        }
    }

    async getAllStaff() {
        try{
            const staffList = await Staff.find();
            return staffList;
        }catch (error) {
            logger.error("Failed to fetch staff : ",error);
            return { message: "Failed to fetch staff. Please try again.", error };
        }
    }
}
