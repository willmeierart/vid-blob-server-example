const knex = require('./knex')

module.exports = {
  getAllVideos: function(){
    return knex('videos')
  },
  getVideo: function(id){
    return knex('videos').where('vimeo_id', id).first()
  },
  addVideo: function(video){
    return knex('videos').insert(video, '*').then(vid=>vid[0])
  },
  updateVideo: function(video, id){
    return knex('videos').where('vimeo_id', id).update(video, '*')
  },
  deleteVideo: function(id){
    return knex('videos').where('vimeo_id', id).del()
  }
}
