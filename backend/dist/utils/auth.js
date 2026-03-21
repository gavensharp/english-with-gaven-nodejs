"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set in production");
}
const EFFECTIVE_JWT_SECRET = JWT_SECRET || "dev-only-insecure-secret";
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, 10);
}
async function verifyPassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
function generateToken(userId) {
    const expiresIn = (process.env.JWT_EXPIRES_IN ||
        "24h");
    return jsonwebtoken_1.default.sign({ userId }, EFFECTIVE_JWT_SECRET, {
        expiresIn,
    });
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, EFFECTIVE_JWT_SECRET, {
            algorithms: ["HS256"],
        });
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=auth.js.map