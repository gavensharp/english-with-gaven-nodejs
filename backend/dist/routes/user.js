"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
// GET /api/users/profile - Get user profile
router.get("/profile", userController_1.getProfile);
// PUT /api/users/profile - Update user profile
router.put("/profile", userController_1.updateProfile);
// PUT /api/users/english-level - Update English level
router.put("/english-level", userController_1.updateEnglishLevel);
// POST /api/users/upload-photo - Upload profile photo
router.post("/upload-photo", upload_1.upload.single("photo"), userController_1.uploadPhoto);
exports.default = router;
//# sourceMappingURL=user.js.map