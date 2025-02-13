import logger from "../logger/Logger";
import Field from "../schema/FieldSchema";

interface Field {
    fieldCode:string;
    fieldName:string;
    fieldLocation:string;
    extentSizeOfTheField:string;
    fieldCrops:string[];
    fieldStaff:string[];
    fieldLogs:string[];
    fieldImage:string;
}

export class FieldRepository{
    async addField(fieldData:Field) {
        try{
            const newField = new Field(fieldData);
            const savedField = await newField.save();
            return savedField;
        }catch(error) {
            logger.error("Faild to save field");
            return {message: "Fiaild to save filed. Try again later"};
        }
    };

    async getAllField() {
        try{
            const fieldList = await Field.find();
            return fieldList;
        }catch (error) {
            logger.error("Failed to fetch field : ",error);
            return { message: "Failed to fetch field. Please try again.", error };
        }
    }
}