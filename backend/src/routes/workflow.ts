import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { WorkflowController } from '../controllers/workflow.controller';

const workflowController = new WorkflowController();

export const workflow: ServerRoute = {
  path: '/api/workflow/init',
  method: 'POST',
  options: {
    validate: {
        query: Joi.object({
            filename: Joi.string().required()
        })
    }
  },
  handler: async (request: Request, h: ResponseToolkit) => {   
    const result = await workflowController.process(request.query.filename);
    return h.response(result.data).code(result.code);
  },
};
