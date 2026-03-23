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
  remarques: String,
  priorite: {
    type: String,
    enum: ['basse', 'moyenne', 'haute'],
    default: 'moyenne'
  },
  noteAttribuee: { type: Boolean, default: false }
});

module.exports = mongoose.model("Assignment", AssignmentSchema);