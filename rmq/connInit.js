var amqp = require('amqplib/callback_api')
const queueMap = require('./const').funMap

amqp.connect('amqp://127.0.0.1', function(err, conn) {
    if (err) {
      console.log(err)
      return
    }
    console.log('启动队列')
    conn.createChannel((err, ch) => {
        //多个队列
        for(var k in queueMap) {
            console.log(k)
            ch.assertQueue(k, {durable: true}, (err, _ok) => {
                if (err) {
                  console.log(err)
                  return
                }
                ch.prefetch(1)
                queueMap[k](ch, _ok)
            })
        }
    })
})