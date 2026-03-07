const interviewRoutes = require("./routes/interviewRoutes");
const userRoutes = require("./routes/userRoutes");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");

dotenv.config();

// Connect to Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("InterviewSense AI Backend Running");
});
app.get("/test", (req, res) => {
  res.send("API working");
});
app.use("/api/interview", interviewRoutes);
app.use("/api/users", userRoutes);
const PORT = process.env.PORT || 5000;




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


