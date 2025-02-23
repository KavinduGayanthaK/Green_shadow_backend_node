import mongoose from "mongoose";
import logger from "../logger/Logger";
import { VehicleModel } from "../model/VehicleModel";
import Staff, { IStaff } from "../schema/StaffSchema";
import Vehicle from "../schema/VehicleSchema";
import { EquipmentModel } from "../model/EquipmentModel";
import Equipment from "../schema/EquipmentSchema";
import { LogModel } from "../model/LogModel";
import Log from "../schema/LogSchema";
import { FieldModel } from "../model/FieldModel";
import Field from "../schema/FieldSchema";

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
    fields?: string[];
    vehicles?: string[];
    equipments?: string[];
    logs?:string[];
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

    async updateStaff(staffId: string, updateData: Partial<IStaff>) {
        try {
            const updateStaff = await Staff.findOneAndUpdate(
                {staffId:staffId},
                {$set: updateData},
                {new: true}
            );

            return updateStaff;
        }catch(error) {
            console.error("Failed to update staff:", error);
            throw error;
        }
    }

    async  deleteStaff(code: string) {
        try {
            const result = await Staff.deleteOne(
                { staffId:code }
            );
            return result
                ? { message: "Staff delete successfully" }
                : { message: "Staff delete unsuccessfully!" };
        } catch (e) {
            console.error("Failed to delete staff:", e);
            throw e;
        }
    }

    async updateStaffAssignVehicle(code: string, vehicleData: VehicleModel) {
        try {
            const vehicleDoc = await Vehicle.findOne({ licensePlateNumber:code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
            if (!vehicleDoc) {
                throw new Error(`Vehicle with code ${code} not found`);
            }
            const vehicleId = vehicleDoc._id;
    
            const existingStaffDocs = await Staff.find({ vehicle: vehicleId }).lean<{ _id: mongoose.Types.ObjectId }[]>();
            const existingStaffIds = existingStaffDocs.map(staff => staff._id);
    
            const updatedStaffDocs = await Staff.find({ code: { $in: vehicleData.vehicleStaffMember } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
            const updatedStaffIds = updatedStaffDocs.map(staff => staff._id);
    
            const staffToRemove = existingStaffIds.filter(id => !updatedStaffIds.includes(id));
            const staffToAdd = updatedStaffIds.filter(id => !existingStaffIds.includes(id));
    
            if (staffToRemove.length > 0) {
                await Staff.updateMany(
                    { _id: { $in: staffToRemove } },
                    { $pull: { vehicles: vehicleId } }
                );
            }
    
            if (staffToAdd.length > 0) {
                await Staff.updateMany(
                    { _id: { $in: staffToAdd } },
                    { $addToSet: { vehicles: vehicleId } }
                );
            }
            return updatedStaffIds;
        } catch (error) {
            console.error("Error updating staff assignVehicles:", error);
            throw error;
        }
    }

    async updateStaffAssignEquipments(code: string, equData: EquipmentModel) {
        try {
            const equipmentDocs = await Equipment.findOne({ equipmentId:code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
            if (!equipmentDocs) {
                throw new Error('Equipment with code ${code} not found');
            }
            const equId = equipmentDocs._id;
    
            const existingStaffDocs = await Staff.find({ assignEquipments: equId }).lean<{ _id: mongoose.Types.ObjectId }[]>();
            const existingStaffIds = existingStaffDocs.map(staff => staff._id);
    
            const updatedStaffDocs = await Staff.find({ code: { $in: equData.equipmentStaffMembers } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
            const updatedStaffIds = updatedStaffDocs.map(staff => staff._id);
    
            const staffToRemove = existingStaffIds.filter(id => !updatedStaffIds.includes(id));
            const staffToAdd = updatedStaffIds.filter(id => !existingStaffIds.includes(id));
    
            if (staffToRemove.length > 0) {
                await Staff.updateMany(
                    { _id: { $in: staffToRemove } },
                    { $pull: { equipments: equId } }
                );
            }
    
            if (staffToAdd.length > 0) {
                await Staff.updateMany(
                    { _id: { $in: staffToAdd } },
                    { $addToSet: { equipments: equId } }
                );
            }
    
            return updatedStaffIds;
        } catch (e) {
            console.error("Error updating staff assignEquipments:", e);
            throw e;
        }
    }
    
    async updateStaffAssignLog(code: string, logData: LogModel) {
        try {
            const logDocs = await Log.findOne({ logCode:code }).
            lean<{ _id: mongoose.Types.ObjectId }>();
            if (!logDocs) {
                throw new Error(`Log with code ${code} not found`);
            }
            const logId = logDocs._id;
    
            const existingStaffDocs = await Staff.
            find({ assignLogs: logId }).
            lean<{ _id: mongoose.Types.ObjectId }[]>();

            const existingStaffIds = existingStaffDocs.map(staff => staff._id);
    
            const updatedStaffDocs = await Staff.find({ code: { $in: logData.logStaff } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
            const updatedStaffIds = updatedStaffDocs.map(staff => staff._id);
    
            const staffToRemoveLog = existingStaffIds.filter(id => !updatedStaffIds.includes(id));
    
            const staffToAddLog = updatedStaffIds.filter(id => !existingStaffIds.includes(id));
    
            if (staffToRemoveLog.length > 0) {
                await Staff.updateMany(
                    { _id: { $in: staffToRemoveLog } },
                    { $pull: { logs: logId } }
                );
            }
    
            if (staffToAddLog.length > 0) {
                await Staff.updateMany(
                    { _id: { $in: staffToAddLog } },
                    { $addToSet: { logs: logId } }
                );
            }
            return updatedStaffIds;
        } catch (e) {
            console.error("Error updating staff assignLogs:", e);
            throw e;
        }
    }
    
    async updateFieldsAssignStaff(code: string, fieldData: FieldModel) {
        try {
            const fieldDocs = await Field.findOne({ fieldCode:code }).
            lean<{ _id: mongoose.Types.ObjectId } | null>();
            if (!fieldDocs) {
                throw new Error(`Field with code ${code} not found`);
            }
            const fieldId = fieldDocs._id;
    
            const existingStaffDocs = await Staff.find({ assignFields: fieldId }).
            lean<{ _id: mongoose.Types.ObjectId }[]>();
            const existingStaffIds = existingStaffDocs.map(staff => staff._id);
    
            const updatedStaffDocs = await Staff.find({ 
                code: { $in: fieldData.fieldStaff } }).
                lean<{ _id: mongoose.Types.ObjectId }[]>();

            const updatedStaffIds = updatedStaffDocs.map(staff => staff._id);
    
            const staffToRemoveField = existingStaffIds.
            filter(id => !updatedStaffIds.includes(id));
    
            const staffToAddField = updatedStaffIds.
            filter(id => !existingStaffIds.includes(id));
    
            if (staffToRemoveField.length > 0) {
                await Staff.updateMany(
                    { _id: { $in: staffToRemoveField } },
                    { $pull: { fields: fieldId } }
                );
            }
    
            if (staffToAddField.length > 0) {
                await Staff.updateMany(
                    { _id: { $in: staffToAddField } },
                    { $addToSet: { fields: fieldId } }
                );
            }
    
            return updatedStaffIds;
        } catch (e) {
            console.error("Error updating staff assignFields:", e);
            throw e;
        }
    }
    
    async deleteVehicleInStaff(code: string) {
        try {
            const vehicleDoc = await Vehicle.findOne({ licensePlateNumber:code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
            if (!vehicleDoc) {
                throw new Error(`Vehicle with code ${code} not found`);
            }
            const vehicleId = vehicleDoc._id;
            return await Staff.updateMany(
                { vehicles: vehicleId },
                { $pull: { vehicles: vehicleId } }
            );
        } catch (e) {
            console.error("Error removing vehicle from staff:", e);
            throw e;
        }
    }
    
    async deleteFieldInStaff(code: string) {
        try {
            const fieldDocs = await Field.findOne({ fieldCode:code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
            if (!fieldDocs) {
                throw new Error(`Field with code ${code} not found`);
            }
            const fieldId = fieldDocs._id;
            return await Staff.updateMany(
                { fields: fieldId },
                { $pull: { fields: fieldId } }
            );
        } catch (e) {
            console.error("Error removing field from staff:", e);
            throw e;
        }
    }
    
    async deleteLogInStaff(code: string) {
        try {
             const logDocs = await Log.findOne({ logCode:code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
             if (!logDocs) {
                 throw new Error(`Log with code ${code} not found`);
             }
             const logId = logDocs._id;
             return await Staff.updateMany(
                 { logs: logId },
                 { $pull: { logs: logId } }
             );
        } catch (e) {
            console.error("Error removing log from staff:", e);
            throw e;
        }
    }
    
    async deleteEquInStaff(code: string) {
        try {
            const equDocs = await Equipment.findOne({ equipmentId:code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
            if (!equDocs) {
                throw new Error('Log with code ${code} not found');
            }
            const equId = equDocs._id;
            return await Staff.updateMany(
                { equipments: equId },
                { $pull: { equipments: equId } }
            );
        } catch (e) {
            console.error("Error removing equipment from staff:", e);
            throw e;
        }
    }
    
    async findStaffById(code: string) : Promise<IStaff | null> {
        return await Staff.findOne({ staffId:code })  // <- Check if this condition is correct
        .populate("fields")  
        .populate("vehicles")
        .populate("equipments")
        .populate("logs")
        .exec();
    }
    
    
    async getSelectedStaff(_ids: mongoose.Types.ObjectId[]) {
        try {
            return await Staff.find({ _id: { $in: _ids } });
        } catch (e) {
            console.error("Error fetching selected staff:", e);
            throw new Error("Failed to fetch selected staff. Please try again.");
        }
    }
}

