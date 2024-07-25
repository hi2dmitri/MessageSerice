const {
  OtpService,
  ReminderService,
  NotificationService,
} = require('./messageService')
class MessageServiceFactory {
  static createService(type, config) {
    switch (type) {
      case 'OTP':
        return new OtpService(config)
      case 'Reminder':
        return new ReminderService(config)
      case 'Notification':
        return new NotificationService(config)
    }
  }
}

module.exports = MessageServiceFactory
