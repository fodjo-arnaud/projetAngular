const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req,res)=>{
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hash,
      role: req.body.role || 'user'
    });
    await user.save();
    res.json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
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

module.exports = router;
