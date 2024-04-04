"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const mongoose_1 = __importStar(require("mongoose"));
const reviewSchema = new mongoose_1.Schema({
    user: Object,
    rating: {
        type: Number,
        default: 0,
    },
    comment: String,
    commentReplies: [Object],
}, { timestamps: true });
const ebookSchema = new mongoose_1.default.Schema({
    id: {
        type: Number,
        required: true,
    },
    authorName: {
        type: String,
        required: [true, "Please enter author's name"],
    },
    category: {
        type: String,
        required: [true, "Please enter the category of the eBook"],
    },
    ebookTitle: {
        type: String,
        required: [true, "Please enter the title of the eBook"],
    },
    // ebookpdf: {
    //   type: Object,
    // },
    ebookpdf: {
        public_id: {
            type: String,
            required: [true, "Cloudinary public_id is required"],
        },
        url: {
            type: String,
            required: [true, "Cloudinary URL is required"],
        },
    },
    level: {
        type: String,
        required: [true, "Please enter the level of the eBook"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    aboutEbooks: {
        type: String,
        required: true
    },
    thumbnail: {
        public_id: {
            type: String,
            required: [true, "Cloudinary public_id for the thumbnail is required"],
        },
        url: {
            type: String,
            required: [true, "Cloudinary URL for the thumbnail is required"],
        },
    },
    reviews: [reviewSchema],
    originalPrice: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        required: true
    },
    purchased: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
const EbookModel = mongoose_1.default.model("Ebook", ebookSchema);
exports.default = EbookModel;
