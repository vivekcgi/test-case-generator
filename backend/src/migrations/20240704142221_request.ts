import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('request', (table) => {
    table.increments('id').primary(),
      table.enum('type', ['openapi', 'gql']),
      table.enum('status', ['PENDING', 'IN_PROCESS', 'COMPLETED', 'FAILED']),
      table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('request');
}
