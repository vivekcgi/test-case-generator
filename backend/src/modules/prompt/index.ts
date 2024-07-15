import { GqlPrompt } from './gql';
import { OpenapiPrompt } from './openapi';
import { IPrompt } from './prompt.interface';

export enum promptType {
  GQL = 'gql',
  OPENAPI = 'openapi',
}

const prompts: Record<string, IPrompt> = {
  openapi: new OpenapiPrompt(),
  gql: new GqlPrompt(),
};

export const getPrompt = (promptType: promptType) => {
  return prompts[promptType];
};
