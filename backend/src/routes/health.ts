import { ResponseToolkit, ServerRoute, Request } from '@hapi/hapi';

export const health: ServerRoute = {
  path: '/health',
  method: 'GET',
  options: {},
  handler: async (_: Request, responseToolkit: ResponseToolkit) => {
    const data = { key: 'success' };

    return responseToolkit.response(data).code(200);
  },
};
