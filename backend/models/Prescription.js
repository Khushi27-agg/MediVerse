const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patientName: { type: String, required: true },
    doctorName: { type: String, required: true },
    medicines: [
      {
        name: { type: String, required: true },
        dosage: { type: String, default: "" },
        duration: { type: String, default: "" },
      },
    ],
    instructions: { type: String, default: "" },
    date: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
