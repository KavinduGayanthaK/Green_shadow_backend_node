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
});

router.get('/getAllCrop',async(req,res)=>{
    try{
        const cropList = await cropService.getAllCrop();
        res.json(cropList);
    }catch(error) {
        console.log("error get all crop : ",error);
        res.status(400).send("error getting crop")
    }
})


export default router;