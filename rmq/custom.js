var amqp = require('amqplib/callback_api')
const queueName = require('./const').QNAME

function outQueue(funcApply){
    // 连接上RabbitMQ服务器
    amqp.connect('amqp://localhost', function(err, conn) {  
        conn.createChannel(function(err, ch) {
            console.log('开启' + queueName)
            ch.assertQueue(queueName, {durable: false})
            ch.consume(queueName, function(msg) {
                console.log('队列处理')
                return await funcApply(JSON.parse(msg))
                }, {noAck: true})
            })
    })
}
module.exports = outQueue