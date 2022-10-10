const express = require("express");
const { getTopics } = require("./controllers/controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.all("*", (request, response) => {
  response.status(400).send({ message: "Bad Request" });
});

app.use((err, request, response, next) => {
  response.status(500).send({ message: "error in server" });
});

module.exports = app;
