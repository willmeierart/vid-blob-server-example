const initialset = require('../data/initialset')

exports.seed = function(knex, Promise) {
  return knex('videos').del()
  .then(function(){return knex('videos').insert(initialset)})
};
