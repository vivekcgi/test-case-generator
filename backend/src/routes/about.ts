import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';
import { HelloWorldController } from '../controllers/greet.controller';

const hwController = new HelloWorldController();

export const about: ServerRoute = {
  path: '/about',
  method: 'GET',
  options: {},
  handler: async (_: Request, responseToolkit: ResponseToolkit) => {
    const data = await hwController.message();
    return responseToolkit.response(data).code(200);
  }
};