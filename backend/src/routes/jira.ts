import { ResponseToolkit, ServerRoute, Request } from "@hapi/hapi";
import { SettingsController } from "../controllers/settings.controller";
import { createIssue as createJiraIssue } from '../lib/jira'

export const createIssue: ServerRoute = {
    path: '/api/jira/issue/create',
    method: 'POST',
    handler: async (request: Request, h: ResponseToolkit) => {   
      const settings = await SettingsController.getConfig();
      const { instanceUrl, projectKey  } = settings.data.data;
      const response = await createJiraIssue('some-token',instanceUrl, projectKey, 'Test', {});
      return h.response(response.data).code(response.code);
    },
  };