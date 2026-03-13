import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { PostgresService } from "../shared/postgres.service";
import { LlmService } from "src/shared/llm.service";

@Module({
    controllers: [ChatController],
    providers: [PostgresService, ChatService, LlmService],
    exports: []
})
export class ChatModule {}