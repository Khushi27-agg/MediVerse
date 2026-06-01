const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    patientId: String,
    doctorId: String,
    date: String,
    status: {
        type: String,
        default: "Pending",
    },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
