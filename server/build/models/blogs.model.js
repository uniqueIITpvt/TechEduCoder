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
const commentSchema = new mongoose_1.Schema({
    user: Object,
    question: String,
    questionReplies: [Object],
}, { timestamps: true });
const blogSchema = new mongoose_1.default.Schema({
    id: {
        type: Number,
        required: true,
    },
    authorName: {
        type: String,
        required: [true, "Please enter writer's name"],
    },
    Title: {
        type: String,
        required: [true, "Please enter blog title"],
    },
    category: {
        type: String,
        required: [true, "Please enter blog category"],
    },
    // thumbnail: {
    //   type: String,
    //   required: [true, 'Please upload thumbnail'],
    // },
    thumbnail: {
        public_id: {
            type: String,
            require: true
        },
        url: {
            type: String,
            require: true
        },
    },
    BlogContent: {
        type: String,
        required: [true, "Please enter full description"],
    },
    questions: [commentSchema],
}, { timestamps: true });
const blogsModel = mongoose_1.default.model("Blog", blogSchema);
exports.default = blogsModel;
