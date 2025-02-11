import  express  from "express";
import { FieldService } from "../service/FieldService";
import { FieldModel } from "../model/FieldModel";


const fieldService = new FieldService();
const router = express.Router();

router.post('/add',async(req,res)=>{
    const field:FieldModel = req.body;
    try{
        const addField = await fieldService.addField(field);
        res.json(addField);
    }catch(error) {
        console.log("error adding field", error);
        res.status(400).send("error adding field");
    }
})


export default router;