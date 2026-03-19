const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const assignmentRoutes = require("./routes/assignments");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connecté"))
.catch(err=>console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));