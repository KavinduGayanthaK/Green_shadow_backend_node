import  express  from "express";
import { LogService } from "../service/LogService";
import { LogModel } from "../model/LogModel";



const logService = new LogService();
const router = express.Router();

router.post('/add',async(req,res)=>{
    const log:LogModel = req.body;
    try{
        const addLog = await logService.addLog(log);
        res.json(addLog);
    }catch(error) {
        console.log("error adding log", error);
        res.status(400).send("error adding log");
    }
});

router.get('/getAllLog',async(req,res)=>{
    try{
        const logList = await logService.getAllLog();
        res.json(logList);
    }catch(error) {
        console.log("error get all log : ",error);
        res.status(400).send("error getting log");
    }
});


export default router;