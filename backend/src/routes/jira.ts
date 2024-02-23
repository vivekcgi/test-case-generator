import { ResponseToolkit, ServerRoute, Request } from "@hapi/hapi";
import { WorkflowController } from "../controllers/workflow.controller";
import Joi from "joi";

const workflowController = new WorkflowController();

export const createIssue: ServerRoute = {
    path: '/api/jira/export',
    method: 'POST',
    options:{
      validate: {
        payload: Joi.object({
          tests: Joi.array().required().min(1)
        })
      }
    },
    handler: async (request: Request, h: ResponseToolkit) => {   
      const { tests } = request.payload as any;
      const response = await workflowController.exportToJira(tests as any[]);
      return h.response(response.data).code(response.code);
    },
  };