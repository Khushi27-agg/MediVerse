const express = require("express");
const MedicalRecord = require("../models/MedicalRecord");
const { protect, doctorOnly } = require("../middleware/authMiddleware");
const router = express.Router();

// GET records (patient sees own, doctor sees all)
router.get("/", protect, async (req, res) => {
  try {
    const filter =
      req.user.role === "patient" ? { patientId: req.user.id } : {};
    const records = await MedicalRecord.find(filter).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create record (doctor only)
router.post("/", protect, doctorOnly, async (req, res) => {
  try {
    const { patientId, patientName, diagnosis, notes, date } = req.body;
    if (!patientId || !diagnosis)
      return res.status(400).json({ message: "patientId and diagnosis required" });
    const record = new MedicalRecord({
      patientId,
      patientName: patientName || "",
      doctorName: req.user.name,
      diagnosis,
      notes: notes || "",
      date: date || new Date().toISOString().split("T")[0],
    });
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single record
router.get("/:id", protect, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Not found" });
    if (
      req.user.role === "patient" &&
      record.patientId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update record (doctor only)
router.put("/:id", protect, doctorOnly, async (req, res) => {
  try {
    const { diagnosis, notes, date } = req.body;
    const record = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      { diagnosis, notes, date },
      { new: true }
    );
    if (!record) return res.status(404).json({ message: "Not found" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE record (doctor only)
router.delete("/:id", protect, doctorOnly, async (req, res) => {
  try {
    await MedicalRecord.findByIdAndDelete(req.params.id);
    res.json({ message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
