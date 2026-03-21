"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = require("crypto");
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);
// Ensure upload directory exists
const uploadDir = path_1.default.join(__dirname, "../../public/uploads/profile_photo");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Configure storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const safeOriginalName = path_1.default
            .basename(file.originalname)
            .replace(/[^a-zA-Z0-9._-]/g, "_");
        const extension = path_1.default.extname(safeOriginalName).toLowerCase();
        if (!ALLOWED_EXTENSIONS.has(extension)) {
            return cb(new Error("Unsupported file type"), "");
        }
        const uniqueName = `${Date.now()}_${(0, crypto_1.randomUUID)()}${extension}`;
        cb(null, uniqueName);
    },
});
// File filter - only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image files are allowed"));
    }
};
// Multer instance
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB max
    },
});
//# sourceMappingURL=upload.js.map