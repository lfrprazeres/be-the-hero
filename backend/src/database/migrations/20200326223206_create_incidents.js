exports.up = function(knex) {
    return knex.schema.createTable('incidents', (table) => {
        table.increments();
        table.string('title').notNullable();
        table.string('description').notNullable();
        table.decimal('value').notNullable();
        
        // relacionamento entre caso(incident) e ong
        table.string('ong_id').notNullable();

        // referencia a foreign key ong_id com a primary key id dentro de ongs
        table.foreign('ong_id').references('id').inTable('ongs');
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('incidents');
};
