import Hospital from "../models/Hospital.js";

export const getAllHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.json(hospitals);
    } catch (error) {
        console.error("Error fetching hospitals:", error);
        res.status(500).json({ message: "Failed to load hospitals" });
    }
};
