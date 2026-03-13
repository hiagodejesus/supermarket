import { Body, Controller, Post, Headers } from "@nestjs/common";
import { CatalogService } from "./catalog/catalog.service";

@Controller('webhooks')
export class WebhooksController {
    constructor(private readonly catalogService: CatalogService) {}

    @Post('openai')
    async handleOpenAiWebhook(@Body() body: string, @Headers() headers: Record<string, string>) {
        return await this.catalogService.handleEmbeddingWebhook(body, headers);
    }
}