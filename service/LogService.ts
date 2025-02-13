import mongoose, { mongo } from "mongoose";
import { LogRepository } from "../repository/LogRepository";
import { LogModel } from "../model/LogModel";
import Log from "../schema/LogSchema";
;

export class LogService {
    logRepository = new LogRepository;

    async addLog(logData: LogModel) {
        try {
            let logFieldsId: mongoose.Types.ObjectId[] = [];
            let logCropsId: mongoose.Types.ObjectId[] = [];
            let logStaffsId: mongoose.Types.ObjectId[] = [];

            const logFieldsDocs = await Log.find({
                code: {$in: logData.logFields},
            }).lean<{_id: mongoose.Types.ObjectId}[]>();
            logFieldsId = logFieldsDocs.map((field)=>field._id);

            const logCropsDocs = await Log.find({
                code: {$in: logData.logCrops},
            }).lean<{_id: mongoose.Types.ObjectId}[]>();
            logCropsId = logCropsDocs.map((crop)=> crop._id);

            const logStaffsDocs = await Log.find({
                code: {$in: logData.logStaff},
            }).lean<{_id: mongoose.Types.ObjectId}[]>();
            logStaffsId = logStaffsDocs.map((staff)=> staff._id);

            const newLog = new Log({
                logCode: logData.logCode,
                 logDate: logData.logDate, 
                 logDetails: logData.logDetails,
                 logType: logData.logType,
                 logImage: logData.logImage,
                 logFields: logFieldsId,
                 logCrops: logCropsId,
                 logStaff: logStaffsId
            });
            const savedLog = await this.logRepository.addLog(newLog);
            return { message: savedLog };
        }catch (error) {
            console.error("Service layer error: Failed to save log!");
            throw new Error("Failed to save log. Please try again.");
        }
    }

    async getAllLog() {
        try{
          const logList = this.logRepository.getAllLog();
          return logList;
        }catch( error) {
          return error;
        }
      };
}