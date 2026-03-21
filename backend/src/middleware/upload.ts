import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../../public/uploads/profile_photo");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeOriginalName = path
      .basename(file.originalname)
      .replace(/[^a-zA-Z0-9._-]/g, "_");
    const extension = path.extname(safeOriginalName).toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(extension)) {
      return cb(new Error("Unsupported file type"), "");
    }

    const uniqueName = `${Date.now()}_${randomUUID()}${extension}`;
    cb(null, uniqueName);
  },
});

// File filter - only images
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

// Multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB max
  },
});
