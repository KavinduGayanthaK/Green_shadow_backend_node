import logger from "../logger/Logger";
import Crop from "../schema/CropSchema";


interface Crop {
    cropCode: string;
    commonName: string;
    scientificName: string;
    cropCategory: string;
    cropSeason: string;
    cropFields: string[];
    cropLogs: string[];
    cropImage: string;
}

export class CropRepository{
    async addCrop(cropData:Crop) {
        try{
            const newCrop = new Crop(cropData);
            const savedCrop = await newCrop.save();
            return savedCrop;
        }catch(error) {
            logger.error("Faild to save crop");
            return {message: "Fiaild to save crop. Try again later"};
        }
    }
}