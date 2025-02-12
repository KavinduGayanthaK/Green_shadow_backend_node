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
})


export default router;