require('dotenv').config()
const fs = require('fs')
const fetch = require('node-fetch')
const aws = require('aws-sdk')
// const xhr = require('xhr')

const VIMEO_ACCESS_TOKEN = process.env.VIMEO_ACCESS_TOKEN
const S3_BUCKET = process.env.S3_BUCKET
const VIMEO_API = 'https://api.vimeo.com'

module.exports = {
  fetchMP4data: function(id){
    return fetch(`${VIMEO_API}/videos/${id}`, {method:'GET', headers:{Authorization:`Bearer ${VIMEO_ACCESS_TOKEN}`}})
    .then((res)=>{
      return res.json()
      .then((body)=>{
        let validData = [body.pictures.sizes, body.files, body.download]
        validData = validData.map((set)=>{
          return set.sort((a,b)=>{
            return b.width-a.width
          })
        })
        let hls = body.files.find((file)=>{
          return file.quality=='hls'
        })
        let returnData = {
          thumbnail:validData[0][0].link,
          SD_link:{
            quality:validData[1][validData[1].length-2].quality,
            link:validData[1][validData[1].length-2].link,
            size:validData[1][validData[1].length-2].size
          },
          SD_DL:{
            quality:validData[2][validData[2].length-1].quality,
            link:validData[2][validData[2].length-1].link,
            size:validData[2][validData[2].length-1].size
          },
          HD_DL:{
            quality:validData[2][0].quality,
            link:validData[2][0].link,
            size:validData[2][0].size
          },
          HLS_link:{
            quality:hls.quality,
            link:hls.link,
            size:hls.size
          }
        }
        return returnData
      })
    })
  },
  blob: function(req,res,mp4URL){
    const stat = fs.statSync(mp4URL)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1
      const chunksize = (end-start)+1
      const file = fs.createReadStream(mp4URL, {start, end})
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      // console.log(fs.createReadStream(mp4URL).pipe(res));
      res.writeHead(200, head)
      fs.createReadStream(mp4URL).pipe(res)
    }
    // // const xhr = new XMLHttpRequest()
    // xhr.responseType = 'blob'
    // xhr.onload = function() {
    //   const reader = new FileReader()
    //   reader.onloadend = function() {
    //     const byteCharacters = atob(reader.result.slice(reader.result.indexOf(',') + 1))
    //     const byteNumbers = new Array(byteCharacters.length)
    //     for (let i = 0; i < byteCharacters.length; i++) {
    //       byteNumbers[i] = byteCharacters.charCodeAt(i)
    //     }
    //     const byteArray = new Uint8Array(byteNumbers)
    //     const blob = new Blob([byteArray], {type: 'video/mp4'})
    //     const url = URL.createObjectURL(blob)
    //     // console.log(url);
    //   }
    //   reader.readAsDataURL(xhr.response)
    // }
    // // xhr.open('GET', mp4URL)
    // xhr(mp4URL,function(err,resp){
    //   console.log(err)
    //   console.log(resp)
    // })
    // // xhr.send()
    // // console.log(mp4URL);
    // // console.log(element);
  },
  aws: {
    uploadFile: function(file,signedRequest,url){
      fetch(signedRequest, {
        method: 'PUT',
        body: file
      }).then(res=>res.json())
        .then((result)=>{
          console.log(result)
          console.log(url)
        })
    },
    getSignedRequest: function(file){
      fetch(`/sign-s3?file-name=${file.name}&file-type=${file.type}`)
        .then(res=>res.json())
        .then((result)=>{
          console.log(result)
          aws.uploadFile(file, result.signedRequest, result.url)
        })
    },
  }

}
