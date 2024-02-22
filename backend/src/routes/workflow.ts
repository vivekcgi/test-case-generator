import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { readContent } from '../lib/file';
import { generate } from '../lib/prompt';
import { token } from '../lib/auth';

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
    const fileContents = await readContent(request.query.filename);
    const iamResponse = await token();
    const data = await generate(iamResponse.access_token, fileContents);
    return h.response(data).code(200);
  },
};
