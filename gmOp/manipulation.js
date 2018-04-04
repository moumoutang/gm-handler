let request = require('request')
let gm = require('gm')
let ImagePath = process.cwd() + '/temp/'
let fs = require('fs')
let FIleOPER = require('../utils/fileOperator')
/**
 * 组合图片
 * @param {*} bg 
 * @param {*} covers 
 * @param {*} position 
 */
function combine(bg, covers, position) {
  return new Promise((resolve, reject) => {

    var handle = gm().in('-page','+0+0').in(ImagePath + bg.path + '.png')
    covers.forEach((item) => {
      handle = handle.in('-page', '+' + item.posX + '+' + item.posY)
      .in(ImagePath + item.path + '.png')
    })

    let finalPath = ImagePath + getTempPath() + '.png'
    try {
      handle.mosaic().write(finalPath, err => {
        FIleOPER.deleteTempImage([bg])
        FIleOPER.deleteTempImage(covers)
        if (err) {
          reject({
            succ: false,
            err: err
          })
          console.log(err)
          return
        }
        console.log(new Date())

        resolve({
          succ: true,
          path: finalPath
        })
      })
    }catch(err) {
      FIleOPER.deleteTempImage([bg])
      FIleOPER.deleteTempImage(covers)
      reject({
        succ: false,
        err: err
      })
    }
  })
}

/**
 * 下载图片
 * @param {*} obj 
 */
async function requestImage(obj) {
  return new Promise(async (resolve, reject) => {
    if(!obj.url) {
      reject({
        succ: false,
        err: '没有图片链接'
      })
    }
    let bgInfo = await request(obj.url, (error, response, body) => {
        if (error) {
          reject({
            succ: false,
            err: '图片下载失败' + obj.url
          })
          return
        }
      })
      obj.target = bgInfo
      resolve({
        succ: true
      })
  })
}
function getTempPath() {
  return (new Date()).getTime() + Math.random() * 1000 + Math.random() * 1000
}

/**
 * 
 */
async function operate(obj, operations) {
  return new Promise(async (resolve, reject) => {
    let downloadP = await requestImage(obj)
    if (!downloadP.succ) {
      reject(bgDownloadP)
    }
    try{
      let handler = gm(obj.target)
      obj.path = getTempPath()
      operations.forEach((item) => {
        handler = handler[item.method].apply(handler, item.params)
      })
      handler.write(ImagePath + obj.path + '.png', err => {
        if (err) {
          console.log(err)
          reject({
            succ: false
          })
          return
        }
        console.log('write succ')
        resolve({
          succ: true
        })
      })
    }catch(err) {
      console.log(err)
      reject({
        succ: false,
        err: err
      })
    }
  })
}
/**
 * 将多张图合并为一张图
 * {
 *  bg: { //背景图
 *    url
 *    height
 *    width
 *  }
 *  layers: [
 *    {
 *      url
 *      ...........
 *    }
 *  ]
 * }
 * @param {*} obj 
 */
async function combineOneImage(obj) {
  return new Promise(async (resolve, reject) => {
    console.log('\x1B[33m%s\x1b[0m:', '...bg begin...')
    let bgP = await operate(
      obj.bg,
      [{  method: 'resize',
          params: [obj.bg.width, obj.bg.height]
        },{
          method: 'quality',
          params: [95]
      }]
    )
    if (!bgP.succ) {
      reject(bgP)
    }
    console.log('\x1B[33m%s\x1b[0m:', '...bg finshed...')

    if (obj.layers) {
        console.log('\x1B[33m%s\x1b[0m:', '...layers begin...')
        let layersPromise = []
        obj.layers.forEach(item => {
          layersPromise.push(operate(
            item,
            [{  
              method: 'resize',
              params: [item.width, item.height]
            },{
              method: 'quality',
              params: [100]
            },{
              method: 'crop',
              params: [
                item.crop.width, 
                item.crop.height, 
                item.crop.offsetX, 
                item.crop.offsetY
              ]
            },{
              method: 'quality',
              params: [100]
            },]
          ))
        })
        let layersResult = await Promise.all(layersPromise)
        for(let i = 0,l = layersResult.length; i < l; i++) {
          if(!layersResult[i].succ) {
            reject(layersResult[i])
            return
          }
        }
        console.log('\x1B[33m%s\x1b[0m:','...layers finished...')
        resolve(await combine(obj.bg, obj.layers, obj))
    } else {
      resolve({
        succ: true,
        path: obj.bg.path
      })
    }
  })
}

module.exports = {
  combineOneImage
}