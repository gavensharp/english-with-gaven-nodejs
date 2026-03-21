"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../utils/middleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const lessonController_1 = require("../controllers/lessonController");
const router = express_1.default.Router();
// Protected routes (require authentication)
router.get("/my-lessons", middleware_1.authMiddleware, lessonController_1.getMyLessons);
router.post("/book", middleware_1.authMiddleware, lessonController_1.bookLesson); // Changed from /book/:lessonId
router.delete("/cancel/:lessonId", middleware_1.authMiddleware, lessonController_1.cancelLesson);
// Admin routes (require authentication AND admin role)
router.get("/all", middleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, lessonController_1.getAllLessons);
exports.default = router;
//# sourceMappingURL=lessons.js.map