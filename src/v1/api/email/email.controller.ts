import { Body, Controller, Post, HttpCode } from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiNotFoundResponse,
	ApiTags,
} from "@nestjs/swagger";

import { EmailService } from "./email.service";

import { SendEmailBadRequestSchema } from "./service/send/schemas/bad-request.schema";
import { SendEmailInputSchema } from "./service/send/schemas/input.schema";
import { SendEmailNotFoundSchema } from "./service/send/schemas/not-found.schema";

import { ApiConfig } from "v1/config";

@ApiTags(`${ApiConfig.version} - Email`)
@Controller(`${ApiConfig.version}/email`)
export class EmailController {
	public constructor(private readonly EmailService: EmailService) {
		//
	}

	@Post()
	@HttpCode(204)
	@ApiNotFoundResponse({
		type: SendEmailNotFoundSchema,
	})
	@ApiBadRequestResponse({
		type: SendEmailBadRequestSchema,
	})
	@ApiNotFoundResponse({
		type: SendEmailNotFoundSchema,
	})
	public send(@Body() params: SendEmailInputSchema) {
		return this.EmailService.send(params);
	}
}
