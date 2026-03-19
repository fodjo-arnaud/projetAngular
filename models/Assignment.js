const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  nom: String,
  dateDeRendu: Date,
  rendu: Boolean,
  auteur: String,
  matiere: String,
  imageMatiere: String,
  prof: String,
  note: Number,
  remarques: String
});

module.exports = mongoose.model("Assignment", AssignmentSchema);