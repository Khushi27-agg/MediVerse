const mongoose = require("mongoose");

const medicalSchema = new mongoose.Schema({
    patientId: String,
    doctorId: String,
    diagnosis: String,
    notes: String,
});

module.exports = mongoose.model("MedicalRecord", medicalSchema);
