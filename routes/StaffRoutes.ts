import  express  from "express";
import { StaffModel } from "../model/StaffModel";
import { StaffService } from "../service/StaffService";

const stafServie = new StaffService();
const router = express.Router();
router.post('/add',async(req,res)=>{
    const staff:StaffModel = req.body;
    try{
        const addStaff = await stafServie.addStaff(staff);
        res.json(addStaff);
    }catch(error) {
        console.log("error adding staff", error);
        res.status(400).send("error adding staff");
    }
})


export default router;