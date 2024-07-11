import { RelationMappings, RelationMappingsThunk } from 'objection';

import { Fragment } from './Fragments';
import { BaseModel } from './Base';

export class GenResult extends BaseModel {
  id!: string;
  fragmentId!: string;
  data!: any;

  static get tableName() {
    return 'gen_results';
  }

  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    return {
      fragment: {
        relation: BaseModel.HasOneRelation,
        modelClass: Fragment,
        join: {
          from: 'gen_results.fragment_id',
          to: 'fragments.id',
        },
      },
    };
  }
}
