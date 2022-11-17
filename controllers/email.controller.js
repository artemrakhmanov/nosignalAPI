exports.getEmailOTPMessage = (otp, email) => {
    const message = `Your one time password for login is\n\n${otp}\n\nPlease note that NoSignal will never contact you to collect any data. For your privacy and security of your messages please do not share any information present in your account such as your seed phrase with anyone.`
    return message
}

