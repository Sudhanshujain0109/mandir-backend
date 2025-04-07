"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const destinationPath = path.join(__dirname, '../../Images');
        callback(null, destinationPath);
    },
    filename: (req, file, callback) => {
        console.log(file, "multer");
        callback(null, Date.now() + path.extname(file.originalname));
    }
});
exports.upload = multer({ storage: storage });
//# sourceMappingURL=image_upload.js.map