import { ResponseHelper } from '../utils/response-helper';

export class HelloWorldController {
  async message() {
    return ResponseHelper.success('success', { data: 'This is hello world message' });
  }
}
