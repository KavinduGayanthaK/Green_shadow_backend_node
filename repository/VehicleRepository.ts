import Vehicle from "../schema/VehicleSchema";
import logger from "../logger/Logger";

interface Vehicle {
    licensePlateNumber: string;
    category: string;
    fuelType: string;
    vehicleStatus: string;
    specialRemark: string;
    vehicleStaffMember: string;
}

export class VehicleRepoairory {
    async  AddVehicle(vehicleData:Vehicle) {
        try {
            const newVehicle = new Vehicle(vehicleData);
            const save: boolean = await newVehicle.save();
            if (save) {
                logger.info("Vehicle saved");
                return {message : "Vehicle saved successfully"} 
            }else {
                logger.error("Faild saved vehicle");
                return {message: "Faild to save vehicle. Please try again!"}
            }
        }catch(err) {
            logger.error("vehicle not saved ");
        }
    }

    async getAllVehicle() {
        try{
            const vehicleList = await Vehicle.find();
            return vehicleList;
        }catch (error) {
            logger.error("Failed to fetch vehicle : ",error);
            return { message: "Failed to fetch vehicle. Please try again.", error };
        }
    }
}