const { Patient } = require("../models");

// Get All Patients (No Timestamps)
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
};

// Get a Single Patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch patient" });
  }
};

// Create a New Patient
exports.createPatient = async (req, res) => {
  try {
    const { name, abha_number, gender, dob, phone, email, address } = req.body;

    // Check if ABHA number is already registered
    const existingPatient = await Patient.findOne({ where: { abha_number } });


    if (existingPatient) {
      return res.status(400).json({ error: "Patient with this ABHA number already exists" });
    }

    // Create a new patient entry
    const newPatient = await Patient.create({ name, abha_number, gender, dob, phone, email, address });

    res.status(201).json({ message: "Patient registered successfully", patient: newPatient });
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ error: "Failed to create patient" });
  }
};

// Update a Patient
exports.updatePatient = async (req, res) => {
  try {
    const { name, abha_number, gender, dob, phone, email, address } = req.body;
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    await patient.update({ name, abha_number, gender, dob, phone, email, address });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: "Failed to update patient" });
  }
};

// Delete a Patient
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    await patient.destroy();
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete patient" });
  }
};
