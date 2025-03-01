import  express  from "express";
import { VehicleModel } from "../model/VehicleModel";
import { VehicleService } from "../service/VehicleService";
import { validateHeaderValue } from "http";

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
});

router.get('/getAllVehicle',async(req,res)=>{
    try{
        const vehicleList = await vehicleService.getAllVehicle();
        res.json(vehicleList);
    }catch(error) {
        console.log("error get all vehicle : ",error);
        res.status(400).send("error getting vehicle");
    }
});

router.put('/update/:id',async(req,res)=>{
    const id:string = req.params.id;
    const vehicle:VehicleModel = req.body;
    try{
        vehicle.licensePlateNumber = id;
        
        const vehicleList = await vehicleService.updateVehicleService(vehicle);
        res.json(vehicleList);
    }catch(error) {
        console.log("error get all vehicle : ",error);
        res.status(400).send("error adding vehicle")
    }
})
router.delete('/delete/:id',async(req,res)=>{
    const id:string = req.params.id;
    try{
        const vhicleList = await vehicleService.deleteVehicleService(id);
        res.json(vhicleList);
    }catch(error) {
        console.log("error get all vehicle : ",error);
        res.status(400).send("error adding vehicle")
    }
})

export default router;