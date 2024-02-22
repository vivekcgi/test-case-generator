import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { SettingsController } from '../controllers/settings.controller';

const settingsController = new SettingsController();

export const jiraSettings: ServerRoute = {
  path: '/api/jira/config',
  method: 'POST',
  options: {
    validate: {
        payload: Joi.object({
            instanceUrl: Joi.string().required(),
            username: Joi.string().required(),
            token: Joi.string().required(),
            prokectKey: Joi.string().required()
        })
    }
  },
  handler: async (request: Request, h: ResponseToolkit) => {   
    const data = await settingsController.saveConfig(request.payload)
    return h.response(data.data).code(data.code);
  },
};

export const getSetting: ServerRoute = {
  path: '/api/jira/config',
  method: 'GET',
  handler: async (request: Request, h: ResponseToolkit) => {   
    const data = await settingsController.getConfig();
    return h.response(data.data).code(data.code);
  },
};