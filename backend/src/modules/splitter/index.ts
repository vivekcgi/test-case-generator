import { GqlSplitter } from './gql';
import { OpenapiSplitter } from './openapi';
import { ISplitter } from './splitter.interface';

export enum splitterType {
  GQL = 'gql',
  OPENAPI = 'openapi',
}

const splitterMap: Record<string, ISplitter> = {
  gql: new GqlSplitter(),
  openapi: new OpenapiSplitter(),
};

export const getSplitter = (type: splitterType) => {
  return splitterMap[type];
};
