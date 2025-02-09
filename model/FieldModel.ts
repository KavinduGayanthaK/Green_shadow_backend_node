export class StaffModel {
    fieldCode:string;
    fieldName:string;
    fieldLocation:string;
    extentSizeOfTheField:string;
    fieldCrops:string[];
    fieldStaff:string[];
    fieldLogs:string[];
    fieldImage:string;

    constructor(fieldCode:string,fieldName:string,fieldLocation:string,extentSizeOfTheField:string,
        fieldCrops:string[],fieldStaff:string[],fieldLogs:string[],fieldImage:string) {

            this.fieldCode = fieldCode;
            this.fieldName = fieldName;
            this.fieldLocation = fieldLocation;
            this.extentSizeOfTheField = extentSizeOfTheField;
            this.fieldCrops = fieldCrops;
            this.fieldStaff = fieldStaff;
            this.fieldLogs = fieldLogs;
            this.fieldImage = fieldImage;
           
        }
}