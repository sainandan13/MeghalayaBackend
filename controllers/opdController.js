const { OPDVisit, Patient } = require("../models"); // Ensure Patient is imported

// Get All OPD Visits (No Timestamps)
exports.getAllOPDVisits = async (req, res) => {
  try {
    const opdVisits = await OPDVisit.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.json(opdVisits);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch OPD visits" });
  }
};

// Get a Single OPD Visit by ID
exports.getOPDVisits = async (req, res) => {
  try {
    const opdVisits = await OPDVisit.findAll({
      include: [{ model: Patient, attributes: ['name', 'id'] }],
    });
    res.status(200).json(opdVisits);
  } catch (error) {
    console.error("Error fetching OPD visits:", error);
    res.status(500).json({ error: "Failed to fetch OPD visits" });
  }
};

//OPDVisits
exports.getOPDVisits = async (req, res) => {
  try {
    const opdVisits = await OPDVisit.findAll();
    res.status(200).json(opdVisits);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch OPD visits" });
  }
};


// Create an OPD Visit
exports.createOPDVisit = async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const { patient_id, doctor_name, symptoms, diagnosis } = req.body;

    // ✅ Ensure all required fields are provided
    if (!patient_id || !doctor_name || !symptoms || !diagnosis) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // ✅ Check if the patient exists in the database
    const patientExists = await Patient.findOne({ where: { id: patient_id } });
    if (!patientExists) {
      return res.status(404).json({ error: "Patient not found." });
    }

    // ✅ Create OPD Visit
    const newOPDVisit = await OPDVisit.create({
      patient_id,
      doctor_name,
      symptoms,
      diagnosis,
    });

    res.status(201).json(newOPDVisit);
  } catch (error) {
    console.error("Error creating OPD Visit:", error);
    res.status(500).json({ error: "Failed to create OPD visit", details: error.message });
  }
};

// Update an OPD Visit
exports.updateOPDVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctor_name, symptoms, diagnosis } = req.body;

    console.log(`Updating OPD visit with ID: ${id}`); // Debugging log

    if (!id) {
      return res.status(400).json({ error: "Invalid OPD visit ID." });
    }

    // ✅ Check if the OPD visit exists
    const opdVisit = await OPDVisit.findByPk(id);
    if (!opdVisit) {
      return res.status(404).json({ error: `OPD Visit with ID ${id} not found.` });
    }

    // ✅ Update the OPD visit
    await opdVisit.update({ doctor_name, symptoms, diagnosis });

    res.status(200).json({ message: "OPD Visit updated successfully.", opdVisit });
  } catch (error) {
    console.error("Error updating OPD Visit:", error);
    res.status(500).json({ error: "Failed to update OPD visit", details: error.message });
  }
};

// Delete an OPD Visit
exports.deleteOPDVisit = async (req, res) => {
  try {
    const opdVisit = await OPDVisit.findByPk(req.params.id);
    if (!opdVisit) return res.status(404).json({ error: "OPD visit not found" });

    await opdVisit.destroy();
    res.json({ message: "OPD visit deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete OPD visit" });
  }
};
