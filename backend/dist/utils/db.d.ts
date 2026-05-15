import { PrismaClient } from "@prisma/client";
type DbCheckStage = "connect" | "query";
export type DbCheckResult = {
    ok: boolean;
    stage: DbCheckStage;
    code?: string;
    message: string;
};
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare function testDatabaseConnection(): Promise<DbCheckResult>;
export {};
//# sourceMappingURL=db.d.ts.map