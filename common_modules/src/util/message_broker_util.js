const amqp = require("amqplib");

const channel = async (queueName) =>{
    const connection = await amqp.connect("amqp://rabbit-mq-service");
    const channel =  await connection.createChannel();
    await channel.assertQueue(queueName,{durable:false});
    return channel;
}

module.exports = channel;