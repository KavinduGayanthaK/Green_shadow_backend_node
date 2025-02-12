import  express  from "express";
import { StaffModel } from "../model/StaffModel";
import { StaffService } from "../service/StaffService";

const stafServiece = new StaffService();
const router = express.Router();
router.post('/add',async(req,res)=>{
    const staff:StaffModel = req.body;
    try{
        const addStaff = await stafServiece.addStaff(staff);
        res.json(addStaff);
    }catch(error) {
        console.log("error adding staff", error);
        res.status(400).send("error adding staff");
    }
})

router.get('/getAllStaff',async(req,res)=>{
    try{
        const staffList = await stafServiece.getAllStaff();
        res.json(staffList);
    }catch(error) {
        console.log("error get all staff : ",error);
        res.status(400).send("error adding staff")
    }
})

export default router;