exports.up = function(knex, Promise) {
  return knex.schema.createTable('videos', (table)=>{
    table.integer('vimeo_id').primary()
    table.text('SD_link')
    table.text('SD_BLOB')
    table.text('HD_dl')
    table.text('HD_BLOB')
    table.text('HLS_link')
    table.text('thumbnail')
    table.text('entire_json')
  })
};

exports.down = function(knex, Promise) {return knex.schema.dropTableIfExists('videos')};
