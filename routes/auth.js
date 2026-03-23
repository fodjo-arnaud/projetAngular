const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req,res)=>{
  try {
    const { username, password, role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hash,
      role: role || 'user'
    });
    await user.save();
    res.json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" });
  }
});

router.post("/login", async (req,res)=>{
  const user = await User.findOne({username:req.body.username});
  if(!user) return res.status(401).json({ message: "User not found" });

  const valid = await bcrypt.compare(req.body.password,user.password);
  if(!valid) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign({id:user._id,role:user.role},"SECRET");
  res.json({token, role:user.role, username: user.username});
});

// Route pour récupérer la liste de tous les utilisateurs (Étudiants)
router.get("/users", async (req, res) => {
  try {
    // On récupère uniquement le username et le role
    const users = await User.find({}, "username role");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
});

module.exports = router;
