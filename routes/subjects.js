const express = require("express");
const Subject = require("../models/Subject");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const subject = new Subject({
    nom: req.body.nom,
    prof: req.body.prof,
    image: req.body.image
  });

  try {
    const newSubject = await subject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
