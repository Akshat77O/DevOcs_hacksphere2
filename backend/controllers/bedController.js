import Bed from "../models/Bed.js";

// Fetch all beds
export const getAllBeds = async (req, res) => {
  try {
    const beds = await Bed.find();
    res.status(200).json(beds);
  } catch (error) {
    console.error('Error fetching beds:', error);
    res.status(500).json({ message: 'Error fetching beds' });
  }
};

// Fetch bed summary (status summary of all beds)
export const getBedSummary = async (req, res) => {
  try {
    const summary = await Bed.aggregate([
        {
            $group: {
                _id: "$department",
                total: { $sum: 1 }, // Total count of beds per department
                available: {
                    $sum: {
                        $cond: [
                            { $eq: ["$status", "Available"] }, // Condition for 'Available' status
                            1, // If available, increment by 1
                            0, // If not available, increment by 0
                        ],
                    },
                },
            },
        },
    ]);

    res.status(200).json(summary);
  } catch (error) {
    console.error('Error fetching bed summary:', error);
    res.status(500).json({ message: 'Error fetching bed summary' });
  }
};

// Update bed status (by staff)
export const updateBedStatus = async (req, res) => {
  const { bedId, status } = req.body;
  try {
    const bed = await Bed.findById(bedId);
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }

    bed.status = status;
    if (status === 'Available') {
      bed.patientId = null;
      bed.patientName = null;
    }

    await bed.save();
    res.status(200).json(bed);
  } catch (error) {
    console.error('Error updating bed status:', error);
    res.status(500).json({ message: 'Error updating bed status' });
  }
};

// Add or update bed
export const addOrUpdateBed = async (req, res) => {
  const { bedId, bedNumber, department, ward, status, patientName, patientId, admissionDate } = req.body;

  try {
    let bed;
    if (bedId) {
      bed = await Bed.findById(bedId);
      if (!bed) {
        return res.status(404).json({ message: 'Bed not found' });
      }
    } else {
      bed = new Bed({ bedNumber });
    }

    bed.bedNumber = bedNumber;
    bed.department = department;
    bed.ward = ward;
    bed.status = status;
    bed.patientName = patientName || null;
    bed.patientId = patientId || null;
    bed.admissionDate = admissionDate || null;

    await bed.save();
    res.status(200).json(bed);
  } catch (error) {
    console.error('Error adding/updating bed:', error);
    res.status(500).json({ message: 'Error adding/updating bed' });
  }
};

