let EventEmitter = require('events').EventEmitter
const getFun = require('./getters').getFun
const GET_F = require('./const').GET_F
const combineOneImage = require('./manipulation').combineOneImage
let request = require('request')
let gm = require('gm')

class GmOperator extends EventEmitter {
  constructor() {
    super()
  }
  async fullImageInfo(imgO) {
    let result = {}
    let funcs = []
    let _img = gm(imgO)
    GET_F.forEach((item) => {
      funcs.push(getFun(_img, item))
    })
    let info = await Promise.all(funcs)
    info.forEach(item => {
      if (item.status === 'succ') {
        Object.assign(result, item.data)
      }
    })
    return Promise.resolve(result)
  }
  async combineImages(data) {
    let images = data.images
    let combinePrs = []
    data.images.forEach(item => {
      combinePrs.push(combineOneImage(item))
    })
    let combineFinsih = await Promise.all(combinePrs)
    return combineFinsih
  }
}
module.exports = new GmOperator()

