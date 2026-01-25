const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config");
const cookieParser = require("cookie-parser")

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true // allow cookies
}));


// Routes will go here
app.get("/", (req, res) => res.send("API running"));

// Routes
app.use("/api", require("./routes/authRoutes"));
app.use("/api",require("./routes/clientRoutes"))
app.use("/api/project", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/invoices", require("./routes/invoiceRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
