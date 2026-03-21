"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
const auth_1 = require("../utils/auth");
const db_1 = require("../utils/db");
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
async function signup(req, res) {
    try {
        const { name, email, password } = req.body;
        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (typeof name !== "string" ||
            name.trim().length < 2 ||
            name.length > 80) {
            return res
                .status(400)
                .json({ error: "Name must be between 2 and 80 characters" });
        }
        if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        if (typeof password !== "string" ||
            password.length < 8 ||
            password.length > 128) {
            return res
                .status(400)
                .json({ error: "Password must be between 8 and 128 characters" });
        }
        // Check if user exists
        const existingUser = await db_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }
        // Hash password
        const password_hash = await (0, auth_1.hashPassword)(password);
        // Create user (only name, email, password)
        const user = await db_1.prisma.user.create({
            data: {
                name,
                email,
                password_hash,
                timezone: "UTC",
            },
        });
        // Generate token
        const token = (0, auth_1.generateToken)(user.id);
        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Failed to sign up" });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ error: "Email and password are required" });
        }
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        if (password.length < 8 || password.length > 128) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        // Find user
        const user = await db_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        // Verify password
        const isValid = await (0, auth_1.verifyPassword)(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        // Generate token
        const token = (0, auth_1.generateToken)(user.id);
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                english_level: user.english_level,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Failed to login" });
    }
}
//# sourceMappingURL=authController.js.map