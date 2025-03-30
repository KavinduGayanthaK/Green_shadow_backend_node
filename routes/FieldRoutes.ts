import  express  from "express";
import { FieldService } from "../service/FieldService";
import { FieldModel } from "../model/FieldModel";


const fieldService = new FieldService();
const router = express.Router();

router.post('/add',async(req,res)=>{
    const file = req.body.file;
    const base64 = file?.buffer.toString('base64');
    const field:FieldModel = req.body;
    try{
        field.fieldImage = base64;
        const addField = await fieldService.addField(field);
        res.json(addField);
    }catch(error) {
        console.log("error adding field", error);
        res.status(400).send("error adding field");
    }
});

router.get('/getAllField',async(req,res)=>{
    try{
        const fieldList = await fieldService.getAllFields();
        res.json(fieldList);
    }catch(error) {
        console.log("error get all field : ",error);
        res.status(400).send("error getting field");
    }
});


export default router;