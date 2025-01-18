import { documentation } from './documentation';
import { generation } from './generation';
import { testQueue } from './test';

export const pipelines = {
  test: testQueue,
  documentation: documentation,
  generation: generation,
};
