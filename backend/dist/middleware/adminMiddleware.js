"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = adminMiddleware;
const db_1 = require("../utils/db");
async function adminMiddleware(req, res, next) {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        // Check if user exists and is admin
        const user = await db_1.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.role !== "admin") {
            return res.status(403).json({ error: "Access denied. Admin only." });
        }
        next();
    }
    catch (error) {
        console.error("Admin middleware error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
//# sourceMappingURL=adminMiddleware.js.map