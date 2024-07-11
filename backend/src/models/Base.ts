import { Model, snakeCaseMappers } from 'objection';

import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';

export class BaseModel extends Model {
  $beforeInsert() {
    (this as any).id = uuidv4();
    (this as any).created_at = DateTime.local().toSQL({ includeOffset: false });
  }

  $beforeUpdate() {
    (this as any).updated_at = DateTime.local().toSQL({ includeOffset: false });
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
  }
}
