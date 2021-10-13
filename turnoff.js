const AWS = require('aws-sdk');

const spawn = require('child_process').spawn;

// Set the region
AWS.config.update({region: 'us-east-1'});

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const queueURL = process.env.QUEUE_URL;

var params = {
    AttributeNames: [
        "SentTimestamp"
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
        "All"
    ],
    QueueUrl: queueURL,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 0
};

sqs.receiveMessage(params, function(err, data) {
    if (err) {
        console.log("Receive Error", err);
    } else if (data.Messages) {
        const deleteParams = {
            QueueUrl: queueURL,
            ReceiptHandle: data.Messages[0].ReceiptHandle
        };
        sqs.deleteMessage(deleteParams, function(err, data) {
            if (err) {
                console.log("Delete Error", err);
            } else {
                console.log("Message Deleted", data);
            }
        });

        const { turnoff }  = data.Messages[0];
        if (turnoff){
            return spawn('shutdown', ['-f']);
        }else{
            console.log('nothing to do')
        }
    }
});