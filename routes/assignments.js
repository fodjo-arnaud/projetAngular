const express = require("express");
const Assignment = require("../models/Assignment");
const router = express.Router();

router.get("/", async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 20;
  let skip = (page - 1) * limit;

  // Construction du filtre de recherche
  let query = {};

  // 1. Recherche par nom ou auteur (insensible à la casse)
  if (req.query.search) {
    query.$or = [
      { nom: { $regex: req.query.search, $options: 'i' } },
      { auteur: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // 2. Filtrage par statut (rendu true/false)
  if (req.query.rendu !== undefined && req.query.rendu !== '') {
    query.rendu = req.query.rendu === 'true';
  }

  try {
    const data = await Assignment.find(query).skip(skip).limit(limit);
    const total = await Assignment.countDocuments(query);

    res.json({
      docs: data,
      totalDocs: total,
      limit: limit,
      page: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const a = new Assignment(req.body);
  await a.save();
  res.json(a);
});

router.put("/:id", async (req, res) => {
  const updatedAssignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ message: "updated", assignment: updatedAssignment });
});

router.delete("/:id", async (req, res) => {
  await Assignment.findByIdAndDelete(req.params.id);
  res.json({ message: "deleted" });
});

module.exports = router;
