const { Prescription } = require("../models");

// Get All Prescriptions (No Timestamps)
exports.getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prescriptions" });
  }
};

// Get a Single Prescription by ID
exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findByPk(req.params.id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (!prescription) return res.status(404).json({ error: "Prescription not found" });
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prescription" });
  }
};

// Create a Prescription
exports.createPrescription = async (req, res) => {
  try {
    console.log("Received request body:", req.body); // ✅ Check if frontend sends data
    const { patient_id, opd_id, medication, dosage, frequency, duration } = req.body;

    if (!patient_id || !opd_id || !medication || !dosage || !frequency || !duration) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newPrescription = await Prescription.create({
      patient_id,
      opd_id,
      medication,
      dosage,
      frequency,
      duration,
    });

    res.status(201).json(newPrescription);
  } catch (error) {
    console.error("Error creating prescription:", error); // ✅ Log backend errors
    res.status(500).json({ error: "Failed to create prescription" });
  }
};

// Update a Prescription
exports.updatePrescription = async (req, res) => {
  try {
    const { medication, dosage, frequency, duration } = req.body;
    const prescription = await Prescription.findByPk(req.params.id);
    if (!prescription) return res.status(404).json({ error: "Prescription not found" });

    await prescription.update({ medication, dosage, frequency, duration });
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ error: "Failed to update prescription" });
  }
};

// Delete a Prescription
exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByPk(req.params.id);
    if (!prescription) return res.status(404).json({ error: "Prescription not found" });

    await prescription.destroy();
    res.json({ message: "Prescription deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete prescription" });
  }
};
