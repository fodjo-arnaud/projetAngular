const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prof: { type: String, required: true },
  image: { type: String, required: true }
});

module.exports = mongoose.model("Subject", SubjectSchema);
