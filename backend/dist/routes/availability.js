"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../utils/middleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const availabilityController_1 = require("../controllers/availabilityController");
const router = express_1.default.Router();
// Public routes (anyone can view available slots)
router.get("/available", availabilityController_1.getAvailableSlots);
// Admin routes (require authentication AND admin role)
router.get("/all", middleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, availabilityController_1.getAllSlots);
router.post("/create", middleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, availabilityController_1.createAvailabilitySlot);
router.delete("/delete/:slotId", middleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, availabilityController_1.deleteAvailabilitySlot);
exports.default = router;
//# sourceMappingURL=availability.js.map