"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const middleware_1 = require("../utils/middleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const router = (0, express_1.Router)();
// All routes require authentication and admin role
router.use(middleware_1.authMiddleware);
router.use(adminMiddleware_1.adminMiddleware);
// GET /api/admin/users - Get all users
router.get("/users", adminController_1.getAllUsers);
// GET /api/admin/users/:id - Get specific user details
router.get("/users/:id", adminController_1.getUserDetails);
exports.default = router;
//# sourceMappingURL=admin.js.map