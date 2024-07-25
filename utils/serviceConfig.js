require('dotenv').config()

const serviceConfig = {
  otpEmailConfig: {
    queueUrl: process.env.EMAIL_OTP_QUEUE_URL,
    type: 'email',
    name: 'OTP',
    limit: 3,
  },
  reminderEmailConfig: {
    queueUrl: process.env.EMAIL_REMINDER_QUEUE_URL,
    type: 'email',
    name: 'reminder',
    limit: 3,
  },
  notificationEmailConfig: {
    queueUrl: process.env.EMAIL_NOTIFICATION_QUEUE_URL,
    type: 'email',
    name: 'notification',
    limit: 8,
  },
  otpSmsConfig: {
    queueUrl: process.env.SMS_OTP_QUEUE_URL,
    type: 'sms',
    name: 'OTP',
    limit: 2,
  },
  reminderSmsConfig: {
    queueUrl: process.env.SMS_REMINDER_QUEUE_URL,
    type: 'sms',
    name: 'reminder',
    limit: 2,
  },
  notificationSmsConfig: {
    queueUrl: process.env.SMS_NOTIFICATION_QUEUE_URL,
    type: 'sms',
    name: 'notification',
    limit: 6,
  },
}

module.exports = serviceConfig
