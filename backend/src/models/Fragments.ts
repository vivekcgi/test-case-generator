import { RelationMappings, RelationMappingsThunk } from 'objection';
import path from 'path';
import { BaseModel } from './Base';
import { Request } from './Requests';
import { GenResult } from './Results';
import { GenError } from './Errors';

export class Fragment extends BaseModel {
  id!: string;
  requestId!: string;
  name!: string;
  data!: string;
  status!: string;
  request!: Request;
  result!: GenResult;
  error!: GenError;

  static get tableName() {
    return 'fragments';
  }

  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    return {
      request: {
        relation: BaseModel.HasOneRelation,
        modelClass: path.join(__dirname, '/Requests'),
        join: {
          from: 'fragments.request_id',
          to: 'requests.id',
        },
      },
      result: {
        relation: BaseModel.HasOneRelation,
        modelClass: path.join(__dirname, '/Results'),
        filter: (query) =>
          query.select('id', 'fragment_id', 'data').orderBy('created_at', 'DESC').first(),
        join: {
          from: 'fragments.id',
          to: 'gen_results.fragment_id',
        },
      },
      error: {
        relation: BaseModel.HasOneRelation,
        modelClass: path.join(__dirname, '/Errors'),
        filter: (query) =>
          query.select('id', 'fragment_id', 'message').orderBy('created_at', 'DESC').first(),
        join: {
          from: 'fragments.id',
          to: 'gen_errors.fragment_id',
        },
      },
    };
  }
}
