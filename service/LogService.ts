import mongoose, { mongo } from "mongoose";
import { LogRepository } from "../repository/LogRepository";
import { LogModel } from "../model/LogModel";
import Log, { ILog, LogType } from "../schema/LogSchema";
import { FieldRepository } from "../repository/FieldRepository";
import { CropRepository } from "../repository/CropRepository";
import { StaffRepository } from "../repository/StaffRepository";
import Field from "../schema/FieldSchema";
import Crop from "../schema/CropSchema";
import Staff from "../schema/StaffSchema";
;

export class LogService {
    logRepository = new LogRepository;
    fieldRepository = new FieldRepository;
    cropRepository = new CropRepository;
    staffRepository = new StaffRepository;

   
    async generateLogCode(): Promise<string> {
        try {
          const lastLog = await Log.findOne()
            .sort({ logCode: -1 })
            .lean<{ logCode: string } | null>();
          if (lastLog?.logCode) {
            const lastIdNumber = parseInt(
                lastLog.logCode.replace("LOG-", ""),
              10
            );
            return `LOG-${(lastIdNumber + 1).toString().padStart(3, "0")}`;
          }
          return "LOG-001";
        } catch (error) {
          console.error("Error generating log code:", error);
          throw new Error("Failed to generate log code.");
        }
      }

    async addLog(logData: LogModel) {
        try {
            let logFieldsId: mongoose.Types.ObjectId[] = [];
            let logCropsId: mongoose.Types.ObjectId[] = [];
            let logStaffsId: mongoose.Types.ObjectId[] = [];
            let logFieldsName: string[] = [];
            let logCropsName: string[] = [];
            let logStaffsName: string[] = [];

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

            const newLogCode = await this.generateLogCode();
            logData.logCode = newLogCode;
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
            await this.fieldRepository.updateFieldAssignLog(logData.logCode,logData);
            await this.cropRepository.updateCropAssignLog(logData.logCode,logData);
            await this.staffRepository.updateStaffAssignLog(logData.logCode,logData);

            const getFields = await this.fieldRepository.getSelectedField(savedLog.logFields);
            logFieldsName = getFields.map((field)=>field.fieldName);

            const getCrops = await this.cropRepository.getSelectedCrop(savedLog.logCrops);
            logCropsName = getCrops.map((crop)=>crop.commonName)

            const getStaff = await this.staffRepository.getSelectedStaff(savedLog.logStaff);
            logStaffsName = getStaff.map((staff)=>staff.firstName);

            const modifiedResult = {
                ...savedLog.toObject(),
                logFields: logFieldsName,
                logCrops: logCropsName,
                logStaff: logStaffsName
            };
            return modifiedResult;
        }catch (error) {
            console.error("Service layer error: Failed to save log!");
            throw new Error("Failed to save log. Please try again.");
        }
    }

    async updateLog(id: string, logData: LogModel) {
        try {
            const existingLog = await this.logRepository.findLogById(id)
            if(!existingLog) {
                throw new Error("Log not found")
            }

            let updateLogFieldsId: mongoose.Types.ObjectId[] = [];
            let updateLogCropsId: mongoose.Types.ObjectId[] = [];
            let updateLogStaffsId: mongoose.Types.ObjectId[] = [];
            let updateLogFieldsName: string[] = [];
            let updateLogCropsName: string[] = [];
            let updateLogStaffsName: string[] = [];

            if(
                (logData.logFields && Array.isArray(logData.logFields)) || 
                (logData.logCrops && Array.isArray(logData.logCrops)) || 
                (logData.logStaff && Array.isArray(logData.logStaff)) 
            ) {
                const logFieldsDoc = await Field.find({
                    fieldCode: {$in: logData.logFields}
                });
                updateLogFieldsId = logFieldsDoc.map(
                    (field)=>field._id as mongoose.Types.ObjectId
                );

                const logCropsDoc = await Crop.find({
                    cropCode: {$in: logData.logCrops}
                });
                updateLogCropsId = logCropsDoc.map(
                    (crop)=>crop._id as mongoose.Types.ObjectId
                );

                const logStaffDoc = await Staff.find({
                    staffId: {$in: logData.logStaff}
                });
                updateLogStaffsId = logStaffDoc.map(
                    (staff)=>staff._id as mongoose.Types.ObjectId
                );
            }

            const updateData: Partial<ILog> = {
                logCode: logData.logCode,
                logDate: logData.logDate, 
                logDetails: logData.logDetails,
                logType: logData.logType as LogType,
                logImage: logData.logImage,
                logFields: updateLogFieldsId,
                logCrops: updateLogCropsId,
                logStaff: updateLogStaffsId
            }

            const result = await this.logRepository.updateLog(logData.logCode,updateData);
            await this.fieldRepository.updateFieldAssignLog(logData.logCode,logData);
            await this.cropRepository.updateCropAssignLog(logData.logCode,logData);
            await this.staffRepository.updateStaffAssignLog(logData.logCode,logData)

            const getFields = await this.fieldRepository.getSelectedField(result.logFields);
            updateLogFieldsName = getFields.map((field)=>field.fieldName)

            const getCrops = await this.cropRepository.getSelectedCrop(result.logCrops);
            updateLogCropsName = getCrops.map((crop)=>crop.commonName);

            const getStaff = await this.staffRepository.getSelectedStaff(result.logStaff);
            updateLogStaffsName = getStaff.map((staff)=>staff.firstName);

            const modifiedResult = {
                ...result.toObject(),
                logFields: updateLogFieldsName,
                logCrops: updateLogCropsName,
                logStaff: updateLogStaffsName,
            };

            return modifiedResult;

        }catch (e) {
            console.error("Service layer error: Failed to update logs!", e);
            throw new Error("Failed to update logs, Please try again.");
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

      async  deleteLog(code: string) {
        try {
          const existingLog = await this.logRepository.findLogById(code);
          console.log(existingLog);
          if (!existingLog) {
              console.warn(`Log  ${code} not found, skipping delete.`);
              return { message: `Log ${code} not found, no deletion performed.` };
          }
    
          await Promise.all([
              this.fieldRepository.deleteLogInField(code),
              this.cropRepository.deleteLogInCrop(code),
              this.staffRepository.deleteLogInStaff(code),
          ]);
          
          await this.logRepository.deleteLog(code);
          return { message: `Log ${code} successfully deleted.` };
        } catch (e) {
          console.error("Service layer error: Failed to delete Log!", e);
          throw new Error("Failed to delete Log, Please try again.");
        }
      }
}