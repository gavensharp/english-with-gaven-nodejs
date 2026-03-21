export declare function hashPassword(password: string): Promise<string>;
export declare function verifyPassword(password: string, hash: string): Promise<boolean>;
export declare function generateToken(userId: number): string;
export declare function verifyToken(token: string): {
    userId: number;
} | null;
//# sourceMappingURL=auth.d.ts.map