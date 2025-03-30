export class CropModel {
    cropCode: string;
    commonName: string;
    scientificName: string;
    cropCategory: string;
    cropSeason: string;
    cropFields: string[];
    cropLogs: string[];
    cropImage: string | null;
  
    constructor(cropCode: string,commonName: string,scientificName: string,cropCategory: string,
      cropSeason: string,cropFields: string[], cropLogs:string[], cropImage: string | null) {
  
          this.cropCode = cropCode;
          this.commonName = commonName;
          this.scientificName = scientificName;
          this.cropCategory = cropCategory;
          this.cropSeason = cropSeason;
          this.cropFields = cropFields;
          this.cropLogs = cropLogs;
          this.cropImage = cropImage;
      }
  }
  