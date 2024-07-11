import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('requests', (table) => {
    table.uuid('id').primary(),
      table.enum('doc_type', ['openapi', 'gql']).notNullable(),
      table.string('file_key').notNullable(),
      table.enum('status', ['PENDING', 'IN_PROGRESS', 'FAILED', 'COMPLETED']).defaultTo('PENDING'),
      table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('requests');
}
