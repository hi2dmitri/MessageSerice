const {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require('@aws-sdk/client-sqs')
const {
  PinpointClient,
  SendMessagesCommand,
} = require('@aws-sdk/client-pinpoint')

require('dotenv').config()

const pinpointClient = new PinpointClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
})
const queueClient = new SQSClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
})

class MessageService {
  constructor(config) {
    this.config = config
  }
  async sendMessageToUser(message) {
    try {
      const body = JSON.parse(message.Body)
      const params = body.Params
      const command = new SendMessagesCommand(params)
      const resp = await pinpointClient.send(command)
      console.log(`${this.config.type} sent `, JSON.stringify(resp))
      queueClient
        .send(
          new DeleteMessageCommand({
            QueueUrl: this.config.queueUrl,
            ReceiptHandle: message.ReceiptHandle,
          }),
        )
        .catch((err) =>
          console.error(`Error deleting ${this.config.type} from queue`, err),
        )
    } catch (err) {
      console.error(`Error sending ${this.config.type}`, err)
      if (
        err.name !== 'TooManyRequestsException' &&
        err.name !== 'ThrottlingException'
      ) {
        queueClient
          .send(
            new DeleteMessageCommand({
              QueueUrl: this.config.queueUrl,
              ReceiptHandle: message.ReceiptHandle,
            }),
          )
          .catch((err) =>
            console.error(`Error deleting ${this.config.type} from queue`, err),
          )
      }
    }
  }
  async receiveMessagesFromQueue() {
    const params = {
      QueueUrl: this.config.queueUrl,
      MaxNumberOfMessages: this.config.limit,
      WaitTimeSeconds: 20,
    }
    try {
      const data = await queueClient.send(new ReceiveMessageCommand(params))
      if (data.Messages) {
        console.log(
          `Received messages from ${this.config.type} ${this.config.name} queue at ${new Date()}:`,
          data.Messages.length,
        )
        return data.Messages
      } else {
        return []
      }
    } catch (err) {
      console.log(
        `Error while retrieving messages from ${this.config.type} ${this.config.name} queue`,
        err,
      )
      return []
    }
  }

  async pollMessages() {
    try {
      while (true) {
        let messages = await this.receiveMessagesFromQueue()
        const promises = []
        for (const message of messages) {
          promises.push(this.sendMessageToUser(message))
        }
        await Promise.all(promises)
      }
    } catch (err) {
      console.error(err)
    }
  }
}
class OtpService extends MessageService {}

class ReminderService extends MessageService {}

class NotificationService extends MessageService {
  constructor(config) {
    super(config)
    this.lastNotificationsProcessingTime = new Date()
    this.lastNotificationsMessages = 0
  }

  async pollMessages() {
    try {
      while (true) {
        let messages = []
        let notificationsProcessingDiff =
          new Date() - this.lastNotificationsProcessingTime
        let shouldCheckNotifications =
          this.lastNotificationsMessages ||
          notificationsProcessingDiff > 5 * 6 * 1000
        if (!shouldCheckNotifications) {
          await new Promise((res) => setTimeout(res, 5 * 6 * 1000))
        }
        messages = await this.receiveMessagesFromQueue()
        this.lastNotificationsMessages = messages.length
        this.lastNotificationsProcessingTime = new Date()

        const promises = []
        for (const message of messages) {
          promises.push(this.sendMessageToUser(message))
        }
        await Promise.all(promises)
      }
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = { OtpService, ReminderService, NotificationService }
