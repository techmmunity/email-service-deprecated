import { MailerService } from "@nestjs-modules/mailer";

import { TemplateService } from "v1/api/template/template.service";

import { replaceData } from "./helpers/replace-data";
import { validateExtraData } from "./helpers/validate-extra-data";

import { validate } from "./validate";

import { ApplicationEnum } from "core/enums/applications";
import { LanguageEnum } from "core/enums/language";

interface Injectables {
	templateService: TemplateService;
	mailerService: MailerService;
}

export interface SendParams {
	receiverEmail: string;
	templateCode: string;
	application: ApplicationEnum;
	language: LanguageEnum;
	extraData: Record<string, any>;
}

export const send = async (
	{ templateService, mailerService }: Injectables,
	params: SendParams,
) => {
	await validate(params);

	const { templateCode, application, language, receiverEmail, extraData } =
		params;

	const template = await templateService.findFormatted({
		code: templateCode,
		language,
		application,
	});

	const extraDataValidated = await validateExtraData({
		extraData,
		fields: template.fields,
	});

	const subject = replaceData({
		extraData: extraDataValidated,
		string: template.subject,
	});
	const content = replaceData({
		extraData: extraDataValidated,
		string: template.content,
	});

	await mailerService.sendMail({
		subject,
		to: receiverEmail,
		html: content,
	});
};
