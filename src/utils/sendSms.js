import {twilio} from 'twilio';
// import('dotenv').config();
import {dotenv} from "dotenv";
dotenv.config();

// eslint-disable-next-line no-undef
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  const sendSms = async (to, message) => {
  try {
    if (!to || !message) {
      throw new Error('Recipient phone number and message body are required.');
    }
    const response = await client.messages.create({
      body: message,
      // eslint-disable-next-line no-undef
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log('SMS sent successfully:', response.sid);
    return response;
  } catch (error) {
    console.error('Failed to send SMS:', error.message);
    throw error;
  }
};
export default sendSms;
