import  express  from "express";
import { LogService } from "../service/LogService";
import { LogModel } from "../model/LogModel";



const logService = new LogService();
const router = express.Router();

router.post('/add',async(req,res)=>{
    const file = req.body.file;
    const base64 = file?.buffer.toString('base64');
    const log:LogModel = req.body;
    console.log("Ented log add ",log);
    
    try{
        log.logImage = base64;
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

router.delete('/delete/:id',async(req,res)=>{
    const id:string = req.params.id;
    try{
        const logList = await logService.deleteLog(id);
        res.json(logList);
    }catch(error) {
        console.log("error get all log : ",error);
        res.status(400).send("error delete log")
    }
})


export default router;