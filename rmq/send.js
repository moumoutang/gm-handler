var amqp = require('amqplib/callback_api')
const queueName = require('./const').QNAME
console.log(require('./const'))
function enQueue(obj) {
    amqp.connect('amqp://localhost', function(err, conn) {  
        conn.createChannel(function(err, ch) {
            // 声明已经存在的队列  why？
            ch.assertQueue(queueName, {durable: true})
            // 将字符串存入Buffer中，并推入队列
            ch.sendToQueue(queueName, new Buffer(JSON.stringify(obj)), {persistent: true});
            console.log("enQueue " , queueName);
        });
    })
}
module.exports = enQueue