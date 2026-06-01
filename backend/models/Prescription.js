const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
    patientId: String,
    doctorId: String,
    medicines: [String],
    instructions: String,
});

module.exports = mongoose.model("Prescription", prescriptionSchema);
