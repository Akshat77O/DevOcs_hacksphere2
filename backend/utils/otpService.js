import nodemailer from "nodemailer";
import crypto from "crypto";

const otpStorage = new Map(); // Store OTPs temporarily

export const generateOTP = (email) => {
    const otp = crypto.randomInt(1000, 9999).toString();
    otpStorage.set(email, otp);
    setTimeout(() => otpStorage.delete(email), 300000); // OTP expires in 5 minutes
    return otp;
};

export const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"HealthQueue" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP for Verification",
        text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
    });
};

export const verifyOTP = (email, otp) => {
    return otpStorage.get(email) === otp;
};
