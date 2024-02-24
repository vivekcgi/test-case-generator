import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';
import { ResponseHelper } from '../utils/response-helper';
import Joi from 'joi';

export const login: ServerRoute = {
  path: '/api/auth/login',
  method: 'POST',
  options: {
    validate: {
        payload: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
        })
    }
  },
  handler: async (request: Request, h: ResponseToolkit) => {   
    const payload = request.payload  as any;
    if(payload.username === 'jitendra_patil' && payload.password === 'admin'){
        const data = ResponseHelper.success("logged in", {
            access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        })
        return h.response(data.data).code(data.code)
    }

    return h.response(ResponseHelper.error('Unauthorized')).code(401);
  },
};