require('dotenv').config()
const express = require('express');
const cors = require('cors')
const router = express.Router();
const fetch = require('node-fetch')
const queries = require('../db/queries')
const {VIMEO_ACCESS_TOKEN} = process.env
const fn = require('../functions')
const initialset = require('../data/initialset')
const VIMEO_API = 'https://api.vimeo.com'

const whitelist = ['http://coupestudios.com', 'http://coupestudios.com.dev', 'http://localhost:3000/', 'http://coupe.agencyzero.com', 'http://localhost:8080/']
const corsOptions = {
  origin: function (origin, callback) {
    // if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    // } else {
    //   callback(new Error('CORS ERROR'))
    // }
  }
}

// fn.blob(mp4URL)
// fn.fetchMP4data(id)
// fn.aws()

// router.get('/test', cors(corsOptions), (req,res)=>{
//   return initialset.map((vidData,i)=>{
//     fetchMP4(vidData.vimeo_id)
//     .then(data=>data)
//     .catch(err=>console.log('err', err))
//   })
// })
router.get('/blobtest', cors(corsOptions), (req,res)=>{
  const localBlob = fn.blob(req,res,'data/coupe.mp4')
  return localBlob
})

// function fetchMP4(id){
//   return fetch(`${VIMEO_API}/videos/${id}`, {method:'GET', headers:{Authorization:`Bearer ${VIMEO_ACCESS_TOKEN}`}})
//   .then((res)=>res.json())
//   .catch(err=>console.log('err', err))
// }

// router.get('/', cors(corsOptions), (req,res)=>{
//   // queries.getAllVideos().then(videos=>res.json(videos))
// })
//
router.get('/test', cors(corsOptions), (req,res)=>{
  const promises = initialset.map((vidData)=>{
    return fn.fetchMP4data(vidData.vimeo_id)
  })
  return Promise.all(promises).then(vids=>{
    console.log(vids)
    return res.json(vids)
  }).catch(err=>console.log(err))
})
//
// router.get('/:id', cors(corsOptions), (req,res,next)=>{
//   queries.getVideo(req.params.id).then(foundVid=>{
//     if(foundVid){
//       res.json(foundVid)
//     } else {
//       fetchMP4(req.params.id)
//       .then(data=>{
//         // const precise = data.map((item)=>{
//         //   if (item){return item.sort(
//         //     (a,b)=>{return b.width-a.width})}
//         // })
//         // const HQobj = {HD:precise[0][0],thumb:precise[1][0]}
//         // return HQobj
//         // // const postVid = {
//         // //   vimeo_id:req.params.id,
//         // //   entire_json:JSON.stringify(HQobj)
//         // // }
//         // // return queries.addVideo(postVid).then(video=>{
//         // //   res.json(video)
//         // // })
//         return data
//       }).catch(err=>console.log('err', err))
//     }
//   })
// })
//

module.exports=router
