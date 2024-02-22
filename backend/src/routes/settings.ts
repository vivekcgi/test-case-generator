import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { SettingsController } from '../controllers/settings.controller';

export const jiraSettings: ServerRoute = {
  path: '/api/config/jira',
  method: 'POST',
  options: {
    validate: {
        payload: Joi.object({
            instanceUrl: Joi.string().required(),
            username: Joi.string().required(),
            token: Joi.string().required(),
            projectKey: Joi.string().required()
        })
    }
  },
  handler: async (request: Request, h: ResponseToolkit) => {   
    const data = await SettingsController.saveConfig(request.payload)
    return h.response(data.data).code(data.code);
  },
};

export const getSetting: ServerRoute = {
  path: '/api/config/jira',
  method: 'GET',
  handler: async (request: Request, h: ResponseToolkit) => {   
    const data = await SettingsController.getConfig();
    return h.response(data.data).code(data.code);
  },
};