const express = require("express");
const Prescription = require("../models/Prescription");
const { protect, doctorOnly } = require("../middleware/authMiddleware");
const router = express.Router();

// GET prescriptions (patient sees own, doctor sees all)
router.get("/", protect, async (req, res) => {
  try {
    const filter =
      req.user.role === "patient" ? { patientId: req.user.id } : {};
    const prescriptions = await Prescription.find(filter).sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create prescription (doctor only)
router.post("/", protect, doctorOnly, async (req, res) => {
  try {
    const { patientId, patientName, medicines, instructions, date } = req.body;
    if (!patientId || !medicines || medicines.length === 0)
      return res.status(400).json({ message: "patientId and medicines required" });
    const prescription = new Prescription({
      patientId,
      patientName: patientName || "",
      doctorName: req.user.name,
      medicines,
      instructions: instructions || "",
      date: date || new Date().toISOString().split("T")[0],
    });
    await prescription.save();
    res.status(201).json(prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single prescription
router.get("/:id", protect, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ message: "Not found" });
    if (
      req.user.role === "patient" &&
      prescription.patientId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE prescription (doctor only)
router.delete("/:id", protect, doctorOnly, async (req, res) => {
  try {
    await Prescription.findByIdAndDelete(req.params.id);
    res.json({ message: "Prescription deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
