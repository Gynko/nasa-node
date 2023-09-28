const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const path = require("path");

const v1Router = require("./routes/v1Router");

// middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// Routers
app.use("/v1", v1Router);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
