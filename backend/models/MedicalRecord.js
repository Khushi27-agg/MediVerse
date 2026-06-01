const mongoose = require("mongoose");

const medicalSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patientName: { type: String, required: true },
    doctorName: { type: String, default: "" },
    diagnosis: { type: String, required: true },
    notes: { type: String, default: "" },
    date: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalRecord", medicalSchema);
