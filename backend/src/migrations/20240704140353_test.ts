import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('public').createTable('user', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.integer('age');
    table.text('address');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user');
}
