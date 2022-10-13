const express = require("express");
const {
  getTopics,
  getArticleByID,
  getUsers,
  patchIncVotes,
} = require("./controllers/controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/users", getUsers);
app.patch("/api/articles/:article_id", patchIncVotes);

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ message: "400: Bad Request" });
  } else if (err.code === "23503") {
    response.status(404).send({ message: "404: Not Found" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ message: "error in server" });
});

module.exports = app;
