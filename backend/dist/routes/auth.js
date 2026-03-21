"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authRateLimit_1 = require("../middleware/authRateLimit");
const router = express_1.default.Router();
router.post('/signup', authRateLimit_1.authRateLimit, authController_1.signup);
router.post('/login', authRateLimit_1.authRateLimit, authController_1.login);
exports.default = router;
//# sourceMappingURL=auth.js.map