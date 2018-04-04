let responseFormat = require('../utils/responseFormat')
let gmOper = require('../gmOp')
let request = require('request')
let enRmqQueue = require('../rmq/send')
let routerMap = {
  imageDeal: {
    post: async (req, res) => {
      let reqData = req.body
      if (!reqData.callbackUrl) {
        res.status(500).send(responseFormat.errFormat('没有回调地址'))
        return
      }
      if (!reqData.images && !reqData.images.length) {
        res.status(500).send(responseFormat.errFormat('参数缺失'))
        return
      }
      //放入队列
      console.log('进入队列')
      enRmqQueue(reqData)
      res.status(200).json({
        succ: true,
        msg: '提交成功'
      })
    }
  },
  imageInfo: {
    get: async (req, res) => {
      var imageUrl = req.params.imageUrl
      var getter = req.params.getter
      if (imageUrl) {
        let imgGm = await request(imageUrl, (error, response, body) => {
          if (error) {
            res.status(500).send(error)
            return
          }
        })
        let _resData = await gmOper.fullImageInfo(imgGm)
        res.status(200).json(responseFormat.succFormat(_resData))
      } 
    }
  }
}
module.exports = routerMap
