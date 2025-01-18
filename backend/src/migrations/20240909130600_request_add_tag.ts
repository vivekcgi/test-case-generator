import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('requests', (table) => {
    table.string('tag');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('requests', (table) => {
    table.dropColumn('tag');
  });
}
