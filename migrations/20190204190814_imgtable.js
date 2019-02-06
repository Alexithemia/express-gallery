
exports.up = function (knex, Promise) {
  return knex.schema.createTable('images', function (t) {
    t.increments().primary();
    t.string('author').defaultTo('anonymous').notNullable();
    t.string('link', 1024).notNullable();
    t.text('description');
    t.timestamps(true, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('images');
};
