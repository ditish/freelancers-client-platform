const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes will go here
app.get("/", (req, res) => res.send("API running"));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskroutes"));
app.use("/api/invoices", require("./routes/invoiceRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
