
const QNAME = 'IMAGEDEAL'
let gmOper = require('../gmOp')
const funMap = {
  'IMAGEDEAL': (ch, _ok) => {
    ch.consume(QNAME, async function (msg) {
        let _result =  await gmOper.combineImages(JSON.parse(msg.content.toString()))
        console.log(_result.length)
        if (_result[0].succ) {
          ch.ack(msg)
        } else {
          ch.nack(msg)
        }
    }, {
        noAck: false
    })
  }
}
module.exports = {QNAME, funMap}