const MessageServiceFactory = require('./messageServiceFactory')
const serviceConfig = require('./utils/serviceConfig.js')

const otpEmailService = MessageServiceFactory.createService(
  'OTP',
  serviceConfig.otpEmailConfig,
)
const reminderEmailService = MessageServiceFactory.createService(
  'Reminder',
  serviceConfig.reminderEmailConfig,
)
const notificationEmailService = MessageServiceFactory.createService(
  'Notification',
  serviceConfig.notificationEmailConfig,
)
const otpSmsService = MessageServiceFactory.createService(
  'OTP',
  serviceConfig.otpSmsConfig,
)
const reminderSmsService = MessageServiceFactory.createService(
  'Reminder',
  serviceConfig.reminderSmsConfig,
)
const notificationSmsService = MessageServiceFactory.createService(
  'Notification',
  serviceConfig.notificationSmsConfig,
)

otpEmailService.pollMessages()
reminderEmailService.pollMessages()
notificationEmailService.pollMessages()
otpSmsService.pollMessages()
reminderSmsService.pollMessages()
notificationSmsService.pollMessages()
