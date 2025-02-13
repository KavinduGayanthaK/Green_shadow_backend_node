import { VehicleModel } from "../model/VehicleModel";
import { VehicleRepoairory } from "../repository/VehicleRepository";
import Vehicle from "../schema/VehicleSchema";

export class VehicleService {
   
    vehicleRepository = new VehicleRepoairory;

    async addVehicle(vehicleData:VehicleModel) {
        try{
            const newVeicle = new Vehicle({
                licensePlateNumber: vehicleData.licensePlateNumber,
                category: vehicleData.category,
                fuelType: vehicleData.fuelType,
                vehicleStatus: vehicleData.vehicleStatus,
                specialRemark: vehicleData.specialRemark,
                vehicleStaffMember: vehicleData.vehicleStaffMember || null
            });
            const save = await this.vehicleRepository.AddVehicle(newVeicle);
            return { message: "Vehicle saved successfully", vehicle: save };
            
        }catch(error) {
            console.error("Service layer error: Failed to save crops!");
            throw new Error("Failed to save crops. Please try again.");
        }
    }

    async getAllVehicle() {
        try{
          const vehicleList = this.vehicleRepository.getAllVehicle();
          return vehicleList;
        }catch( error) {
          return error;
        }
      };
}