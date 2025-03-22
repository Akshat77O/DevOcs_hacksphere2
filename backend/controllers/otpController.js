import {
    generateOTP,
    sendOTPEmail,
    verifyOTP as checkOTP,
} from "../utils/otpService.js";

export const requestOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = generateOTP(email);
        await sendOTPEmail(email, otp);
        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to send OTP", error });
    }
};

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    if (checkOTP(email, otp)) {
        res.json({ message: "OTP verified successfully" });
    } else {
        res.status(400).json({ message: "Invalid OTP" });
    }
};
