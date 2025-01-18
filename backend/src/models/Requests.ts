import { Fragment } from './Fragments';
import { BaseModel } from './Base';
import { RelationMappings, RelationMappingsThunk } from 'objection';

export class Request extends BaseModel {
  id!: string;
  tag!: string;
  docType!: string;
  fileKey!: string;
  status!: string;
  createdAt!: Date;
  updatedAt!: Date;
  fragments!: Array<Fragment>;

  static get tableName() {
    return 'requests';
  }

  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    return {
      fragments: {
        relation: BaseModel.HasManyRelation,
        modelClass: Fragment,
        join: {
          from: 'requests.id',
          to: 'fragments.request_id',
        },
      },
    };
  }
}
