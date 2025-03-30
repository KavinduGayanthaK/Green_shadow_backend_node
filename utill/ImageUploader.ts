import multer from "multer";
import path from "path";

export class ImageUploader {
    uploader(imageType:string){
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, `uploads/${imageType}/`);
            },
            filename: (req, file, cb) => {
                cb(null, Date.now() + path.extname(file.originalname));
            }
        });
        return multer({ storage: storage});
    }
}