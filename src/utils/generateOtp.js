import crypto from 'crypto'

function generateOTP() {
    // Generate a random number between 0 and 9999
    const otp = crypto.randomInt(0, 10000);

    // Ensure the OTP is 4 digits by padding with leading zeros if necessary
    return otp.toString().padStart(4, '0');
}


export default generateOTP