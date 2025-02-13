import logger from "../logger/Logger";
import Log from "../schema/LogSchema";



interface Log {
    logCode: string;
    logDate: string | null;
    logDetails: string;
    logType: string;
    logImage: string;
    logFields: string[];
    logCrops: string[];
    logStaff: string[];
}

export class LogRepository{
    async addLog(logData: Log) {
        try{
            const newLog = new Log(logData);
            const savedLog = await newLog.save();
            return savedLog;
        }catch(error) {
            logger.error("Faild to save log");
            return {message: "Fiaild to save log. Try again later"};
        }
    }

    async getAllLog() {
        try{
            const logList = await Log.find();
            return logList;
        }catch (error) {
            logger.error("Failed to fetch log : ",error);
            return { message: "Failed to fetch log. Please try again.", error };
        }
    }
}