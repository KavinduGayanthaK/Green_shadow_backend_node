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
router.put('/update/:id',async(req,res)=>{
    const id:string = req.params.id;
    const staff:StaffModel = req.body;
    try{
        staff.staffId = id;
        
        const staffList = await stafServiece.updateStaff(id,staff);
        res.json(staffList);
    }catch(error) {
        console.log("error get all staff : ",error);
        res.status(400).send("error adding staff")
    }
})
router.delete('/delete/:id',async(req,res)=>{
    const id:string = req.params.id;
    try{
        const staffList = await stafServiece.deleteStaff(id);
        res.json(staffList);
    }catch(error) {
        console.log("error get all staff : ",error);
        res.status(400).send("error adding staff")
    }
})


export default router;