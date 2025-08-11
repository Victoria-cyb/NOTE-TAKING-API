require('dotenv').config();
const { sendShareResponseEmail } = require('./src/utils/email'); // adjust path

async function main() {
  await sendShareResponseEmail({
    sender: { email: 'michaelvictoria0422873@gmail.com', firstName: 'Alice' },
    receiver: { email: 'chiamakamichael58.com', firstName: 'Bob' },
    note: { title: 'Project Plan' },
    accepted: true, // or false
  });
  console.log('Email test complete');
}

main().catch(console.error);
