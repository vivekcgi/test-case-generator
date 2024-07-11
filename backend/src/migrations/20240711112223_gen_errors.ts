import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('gen_errors', (table) => {
    table.uuid('id').primary(),
      table.uuid('fragment_id').references('id').inTable('fragments'),
      table.string('message'),
      table.json('data'), // THis should be text
      table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('gen_errors');
}
