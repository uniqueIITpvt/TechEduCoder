"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, file) => {
        return {
            folder: 'eBook',
            // format: ['pdf', 'jpg'], // Force convert to pdf format
            public_id: file.fieldname + '-' + Date.now(),
        };
    },
});
exports.default = storage;
