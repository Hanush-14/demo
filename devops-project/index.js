const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Jenkins + Docker Swarm CI/CD Working");
});

app.listen(3000, () => {
  console.log("App running on port 3000");
});

