"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const image_upload_1 = require("../Middleware/image_upload");
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const UploadImage = express();
const PORT = 3000;
UploadImage.post("/upload-image", image_upload_1.upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({
        message: "Upload successful",
        filePath: `${req.file.filename}`,
    });
});
exports.default = UploadImage;
//# sourceMappingURL=uploadImage.js.map