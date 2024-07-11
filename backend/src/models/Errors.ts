import { RelationMappings, RelationMappingsThunk } from 'objection';

import { Fragment } from './Fragments';
import { BaseModel } from './Base';

export class GenError extends BaseModel {
  id!: string;
  fragmentId!: string;
  message!: string;
  data!: any;

  static get tableName() {
    return 'gen_errors';
  }

  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    return {
      fragment: {
        relation: BaseModel.HasOneRelation,
        modelClass: Fragment,
        join: {
          from: 'gen_errors.fragment_id',
          to: 'fragments.id',
        },
      },
    };
  }
}
