import  express  from "express";
import { VehicleModel } from "../model/VehicleModel";
import { VehicleService } from "../service/VehicleService";

const vehicleService = new VehicleService();
const router = express.Router();


router.post('/add',async(req,res)=>{
    const vehicle: VehicleModel= req.body;
    try{
        const addedVehicle = await vehicleService.addVehicle(vehicle);
        res.json(addedVehicle);
    }catch(err){
        console.log("error adding customer", err);
        res.status(400).send("error adding customer");
    }
})

export default router;