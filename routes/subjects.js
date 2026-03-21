const express = require("express");
const Subject = require("../models/Subject");
const router = express.Router();
const mongoose = require("mongoose");

// GET all subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a subject
router.post("/", async (req, res) => {
  try {
    const subject = new Subject({
      nom: req.body.nom,
      prof: req.body.prof,
      image: req.body.image
    });
    const newSubject = await subject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a subject
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }
  try {
    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      { nom: req.body.nom, prof: req.body.prof, image: req.body.image },
      { new: true, runValidators: true }
    );
    if (!updatedSubject) return res.status(404).json({ message: "Matière non trouvée" });
    res.json(updatedSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a subject
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }
  try {
    const deletedSubject = await Subject.findByIdAndDelete(id);
    if (!deletedSubject) return res.status(404).json({ message: "Matière non trouvée" });
    res.json({ message: "Matière supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
