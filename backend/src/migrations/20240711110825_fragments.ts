import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('fragments', (table) => {
    table.uuid('id').primary(),
      table.uuid('request_id').references('id').inTable('requests'),
      table.string('name'),
      table.text('data', 'longtext'),
      table.enum('status', ['PENDING', 'IN_PROGRESS', 'FAILED', 'COMPLETED']).defaultTo('PENDING'),
      table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('fragments');
}
