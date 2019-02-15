
exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', function (t) {
    t.increments().primary();
    t.string('username').notNullable();
    t.string('password').notNullable();
    t.timestamps(true, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users');
};
