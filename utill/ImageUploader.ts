import multer from "multer";
import path from "path";

export class ImageUploader {
    uploader(imageType: string) {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                
                cb(null, `uploads/${imageType}/`);
            },
            filename: (req, file, cb) => {
                
                const filename = `${imageType}_${Date.now()}${path.extname(file.originalname)}`;
                cb(null, filename);
            }
        });
        return multer({ storage });
    }
}