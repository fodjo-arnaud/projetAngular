const express = require("express");
const Assignment = require("../models/Assignment");
const router = express.Router();

router.get("/", async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 20;
  let skip = (page - 1) * limit;

  // Requête de base
  let query = {};

  // Si un auteur est spécifié (mode élève), on filtre par auteur
  if (req.query.auteur) {
    query.auteur = req.query.auteur;
  }

  // Recherche textuelle
  if (req.query.search) {
    query.$or = [
      { nom: { $regex: req.query.search, $options: 'i' } },
      { auteur: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // Filtrage par statut pour la LISTE uniquement
  let listQuery = { ...query };
  if (req.query.rendu !== undefined && req.query.rendu !== '') {
    listQuery.rendu = req.query.rendu === 'true';
  }

  try {
    const data = await Assignment.find(listQuery).skip(skip).limit(limit);
    const totalFiltered = await Assignment.countDocuments(listQuery);

    // CALCUL DES STATS SUR LA TOTALITÉ DE LA BASE (Sans les filtres de recherche/statut)
    // On ne garde que le filtre d'auteur si on est en mode "user"
    const statsQuery = req.query.auteur ? { auteur: req.query.auteur } : {};

    const totalGlobal = await Assignment.countDocuments(statsQuery);
    const doneGlobal = await Assignment.countDocuments({ ...statsQuery, rendu: true });
    const pendingGlobal = totalGlobal - doneGlobal;

    res.json({
      docs: data,
      totalDocs: totalFiltered,
      limit: limit,
      page: page,
      totalPages: Math.ceil(totalFiltered / limit),
      stats: {
        total: totalGlobal,
        done: doneGlobal,
        pending: pendingGlobal
      }
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
