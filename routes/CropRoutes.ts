import  express  from "express";
import { CropService } from "../service/CropService";
import { CropModel } from "../model/CropModel";


const cropService = new CropService();
const router = express.Router();

router.post('/add',async(req,res)=>{
    const crop:CropModel = req.body;
    try{
        const addCrope = await cropService.addCrop(crop);
        res.json(addCrope);
    }catch(error) {
        console.log("error adding crop", error);
        res.status(400).send("error adding crop");
    }
})


export default router;