const cron = require('node-cron');
const User = require('../models/User');
const { sendReminderEmail } = require('./email');

module.exports.startCron = () => {
  cron.schedule('0 20 * * *', async () => {
    console.log('Running daily reminder cron job');
    const users = await User.find();
    for (const user of users) {
      try {
        await sendReminderEmail(user);
        console.log(`Reminder sent to ${user.email}`);
      } catch (err) {
        console.error(`Failed to send reminder to ${user.email}:`, err);
      }
    }
  });
};