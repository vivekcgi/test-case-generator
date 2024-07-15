import { OpenapiSerializer } from './openapi';
import { ISerialize } from './serializer.interface';

export enum serialierType {
  GQL = 'gql',
  OPENAPI = 'openapi',
}

const serializers: Record<string, ISerialize> = {
  openapi: new OpenapiSerializer(),
};

export const getSerializer = (type: string) => {
  return serializers[type];
};
