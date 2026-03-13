import type { Request, Response } from 'express';
import * as bodyparser from 'body-parser';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class JsonBodyMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: () => void) {
        bodyparser.json()(req, res, next);
    }
}