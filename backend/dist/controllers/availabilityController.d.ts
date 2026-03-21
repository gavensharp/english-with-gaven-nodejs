import { Request, Response } from "express";
export declare const getAvailableSlots: (req: Request, res: Response) => Promise<void>;
export declare const getAllSlots: (req: Request, res: Response) => Promise<void>;
export declare const createAvailabilitySlot: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteAvailabilitySlot: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=availabilityController.d.ts.map