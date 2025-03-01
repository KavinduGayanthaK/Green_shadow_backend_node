export class FieldModel {
  fieldCode: string;
  fieldName: string;
  fieldLocation: string;
  extentSizeOfTheField: string;
  fieldCrops: string[];
  fieldStaff: string[];
  fieldEquipments: string[];
  fieldLogs: string[];
  fieldImage: string;

  constructor(
    fieldCode: string,
    fieldName: string,
    fieldLocation: string,
    extentSizeOfTheField: string,
    fieldCrops: string[],
    fieldStaff: string[],
    fieldEquipments: string[],
    fieldLogs: string[],
    fieldImage: string
  ) {
    this.fieldCode = fieldCode;
    this.fieldName = fieldName;
    this.fieldLocation = fieldLocation;
    this.extentSizeOfTheField = extentSizeOfTheField;
    this.fieldCrops = fieldCrops;
    this.fieldStaff = fieldStaff;
    this.fieldEquipments = fieldEquipments;
    this.fieldLogs = fieldLogs;
    this.fieldImage = fieldImage;
  }
}
