import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      // eslint-disable-next-line no-undef
      user: process.env.EMAIL_USER,
      // eslint-disable-next-line no-undef
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    // eslint-disable-next-line no-undef
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};
 
export default sendEmail;
