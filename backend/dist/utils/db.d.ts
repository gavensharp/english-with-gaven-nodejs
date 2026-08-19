import "dotenv/config";
import type { PrismaClient as PrismaClientType } from "@prisma/client";
export declare const prisma: PrismaClientType<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/client").DefaultArgs>;
export declare function testDatabaseConnection(): Promise<boolean>;
//# sourceMappingURL=db.d.ts.map