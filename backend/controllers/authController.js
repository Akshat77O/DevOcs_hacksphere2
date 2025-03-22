import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/auth.js";

export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res
                .status(400)
                .json({ message: "Email already registered" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        res.json({ user, token: generateToken(user._id) });
    } catch (error) {
        res.status(500).json({ message: "Signup failed", error });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({ user, token: generateToken(user._id) });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error });
    }
};

export const getUserProfile = async (req, res) => {
    res.json(req.user);
};

export const updateUserProfile = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            req.body,
            { new: true }
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Profile update failed", error });
    }
};
