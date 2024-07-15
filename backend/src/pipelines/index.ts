import { documentation } from './documentation';
import { testQueue } from './test';

export const pipelines = {
  test: testQueue,
  documentation: documentation,
};
