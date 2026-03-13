import { Controller, Get, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
    constructor(
        private readonly catalogService: CatalogService,
    ) {}

    @Get()
    getCatalog(@Query('q') search?: string) {
        return this.catalogService.getCatalog(search);
    }

    
}