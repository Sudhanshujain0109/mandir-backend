import { upload } from "../Middleware/image_upload";

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UploadImage = express();


UploadImage.post("/upload-image", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.status(200).json({
    message: "Upload successful",
    filePath: `${req.file.filename}`,
  });
});

export default UploadImage
