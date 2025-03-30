import  express, { Request }  from "express";
import { CropService } from "../service/CropService";
import { CropModel } from "../model/CropModel";
import { ImageUploader } from "../utill/ImageUploader";


const cropService = new CropService();
const router = express.Router();

const imageUploader = new ImageUploader();
const upload = imageUploader.uploader('crop');

router.post('/saveCrop', upload.single('cropImage'), async (req: express.Request,res: express.Response) => {
    try {
        const { commonName, scientificName, cropCategory, cropSeason, cropFields, cropLogs } = req.body;
        const image = req.file ? req.file.filename : null;
        const parsedAssignFields : string[] = cropFields ? JSON.parse(cropFields) : [];
        const parsedAssignLogs: string[] = cropLogs ? JSON.parse(cropLogs) : [];
        const newCode = await cropService.generateCropCode()
       

        if (newCode === null) {
            throw new Error("Crop code is null. Please check the Id Type!");
        }

        const fieldCodes = parsedAssignFields.map((field: any) => field.code);
        const logCodes = parsedAssignLogs.map((log: any) => log.code);

        const newCrop = new CropModel(newCode, commonName, scientificName, cropCategory, cropSeason,fieldCodes, logCodes, image);
        if (newCrop) {
            const result = await cropService.addCrop(newCrop);
            res.status(201).send(result);
        } else {
            console.log("Error, Required crops data!");
        }
    } catch (e) {
        console.log("Failed to save equipment!",e);
        res.status(400).send("Failed to save equipment. Please try again.");
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

router.delete('/delete/:id',async(req,res)=>{
    const id:string = req.params.id;
    try{
        const logList = await cropService.deleteCrop(id);
        res.json(logList);
    }catch(error) {
        console.log("error get all log : ",error);
        res.status(400).send("error delete log")
    }
})


export default router;