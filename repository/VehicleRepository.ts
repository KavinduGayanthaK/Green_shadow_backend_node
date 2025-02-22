import Vehicle, { IVehicle } from "../schema/VehicleSchema";
import logger from "../logger/Logger";
import { StaffModel } from "../model/StaffModel";
import Staff from "../schema/StaffSchema";
import mongoose from "mongoose";

interface VehicleData {
    licensePlateNumber: string;
    category: string;
    fuelType: string;
    vehicleStatus: string;
    specialRemark: string;
    vehicleStaffMember?: string; 
    
}

export class VehicleRepository {
    async addVehicle(vehicleData: VehicleData) {
        try {
            const newVehicle = new Vehicle(vehicleData);
            const savedVehicle = await newVehicle.save(); // Corrected `save()` call
            if (savedVehicle) {
                logger.info("Vehicle saved successfully.");
                return { message: "Vehicle saved successfully" };
            } else {
                logger.error("Failed to save vehicle.");
                return { message: "Failed to save vehicle. Please try again!" };
            }
        } catch (err) {
            logger.error("Vehicle not saved: ", err);
            throw new Error("Failed to save vehicle.");
        }
    }

    async getAllVehicles() {
        try {
            const vehicleList = await Vehicle.find();
            return vehicleList;
        } catch (error) {
            logger.error("Failed to fetch vehicles: ", error);
            return { message: "Failed to fetch vehicles. Please try again.", error };
        }
    }

    async updateVehicle(licensePlateNumber: string, updateData: Partial<IVehicle>) {
        try {
            const updateVehicle = await Vehicle.findOneAndUpdate(
                {licensePlateNumber},
                {$set: updateData},
                {new: true}
            );

            return updateVehicle;
        }catch(error) {
            console.error("Failed to update vehicle:", error);
            throw error;
        }
    }

    async updateVehicleAssignStaff(code: string, staffData: StaffModel) {
        try {
            const staffDoc = await Staff.findOne({ staffId: code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
            if (!staffDoc) {
                throw new Error(`Staff with code ${code} not found`);
            }
            const staffId = staffDoc._id;

            // Get current vehicles assigned to this staff
            const existingVehicleDocs = await Vehicle.find({ vehicleStaffMember: staffId }).lean<{ _id: mongoose.Types.ObjectId }[]>();
            const existingVehicleIds = existingVehicleDocs.map(vehicle => vehicle._id);

            // Get updated list of vehicles from staffData
            const updatedVehicleDocs = await Vehicle.find({ licensePlateNumber: { $in: staffData.vehicles } }).lean<{ _id: mongoose.Types.ObjectId }[]>();
            const updatedVehicleIds = updatedVehicleDocs.map(vehicle => vehicle._id);

            // Find vehicles to remove staff from
            const vehiclesToRemove = existingVehicleIds.filter(id => !updatedVehicleIds.includes(id));
            const vehiclesToAdd = updatedVehicleIds.filter(id => !existingVehicleIds.includes(id));

            // Remove staff from old vehicles
            if (vehiclesToRemove.length > 0) {
                await Vehicle.updateMany(
                    { _id: { $in: vehiclesToRemove } },
                    { $unset: { vehicleStaffMember: "" } } // Removes assigned staff
                );
            }

            // Add staff to new vehicles
            if (vehiclesToAdd.length > 0) {
                await Vehicle.updateMany(
                    { _id: { $in: vehiclesToAdd } },
                    { $set: { vehicleStaffMember: staffId } } // Assigns staff
                );
            }

            return updatedVehicleIds;
        } catch (error) {
            console.error("Error updating staff assignVehicles:", error);
            throw error;
        }
    }

    async getSelectedVehicles(_ids: mongoose.Types.ObjectId[]) {
        try {
            return await Vehicle.find({ _id: { $in: _ids } });
        } catch (e) {
            console.error("Error fetching selected vehicles:", e);
            throw new Error("Failed to fetch selected vehicles. Please try again.");
        }
    }

    async deleteStaffInVehicle(code: string) {
        try {
            const staffDoc = await Staff.findOne({ code }).lean<{ _id: mongoose.Types.ObjectId } | null>();
            if (!staffDoc) {
                throw new Error(`Staff with code ${code} not found`);
            }
            const staffId = staffDoc._id;
            return await Vehicle.updateMany(
                { vehicleStaffMember: staffId },
                { $pull: { vehicleStaffMember: staffId } }
            );
        } catch (e) {
            console.error("Error removing staff from vehicle:", e);
            throw e;
        }
    }

    async findVehicleById(code: string) : Promise<IVehicle | null> {
        return await Vehicle.findOne({ code }).populate("vehicleStaffMember").exec();
    }
}
