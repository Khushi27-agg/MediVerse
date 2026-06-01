const express = require("express");
const Appointment = require("../models/Appointment");
const { protect, doctorOnly } = require("../middleware/authMiddleware");
const router = express.Router();

// GET all appointments (doctor sees all, patient sees own)
router.get("/", protect, async (req, res) => {
  try {
    const filter =
      req.user.role === "patient" ? { patientId: req.user.id } : {};
    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create appointment (patient)
router.post("/", protect, async (req, res) => {
  try {
    const { doctorName, date, time, reason } = req.body;
    if (!date) return res.status(400).json({ message: "Date is required" });
    const appointment = new Appointment({
      patientId: req.user.id,
      patientName: req.user.name,
      doctorName: doctorName || "",
      date,
      time: time || "",
      reason: reason || "",
      status: "Pending",
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update status (doctor approves/cancels)
router.patch("/:id/status", protect, doctorOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Pending", "Approved", "Cancelled", "Completed"];
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status" });
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: "Not found" });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE appointment
router.delete("/:id", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Not found" });
    if (
      req.user.role === "patient" &&
      appointment.patientId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await appointment.deleteOne();
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
