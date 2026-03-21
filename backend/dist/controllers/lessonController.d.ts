import { Request, Response } from "express";
export declare const getMyLessons: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const bookLesson: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const cancelLesson: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllLessons: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=lessonController.d.ts.map