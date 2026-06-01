const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patientName: { type: String, required: true },
    doctorName: { type: String, default: "" },
    date: { type: String, required: true },
    time: { type: String, default: "" },
    reason: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Cancelled", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
