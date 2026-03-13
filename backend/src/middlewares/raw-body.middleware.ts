import type { Request, Response } from 'express';
import * as bodyparser from 'body-parser';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: () => void) {
        bodyparser.text({type: '*/*'})(req, res, next);
    }
}