import  express  from "express";
import { EquipmentService } from "../service/EquipmentService";
import { EquipmentModel } from "../model/EquipmentModel";



const equipmentService = new EquipmentService();
const router = express.Router();

router.post('/add',async(req,res)=>{
    const equipment:EquipmentModel = req.body;
    try{
        const addEquipment = await equipmentService.addEquipment(equipment);
        res.json(addEquipment);
    }catch(error) {
        console.log("error adding equipment", error);
        res.status(400).send("error adding equipment");
    }
});

router.get('/getAllEquipment',async(req,res)=>{
    try{
        const equipmentList = await equipmentService.getAllEquipment();
        res.json(equipmentList);
    }catch(error) {
        console.log("error get all equipment : ",error);
        res.status(400).send("error getting equipment")
    }
});



export default router;