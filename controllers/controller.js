const { selectTopics, selectArticleByID, selectUsers } = require("../models/model");

exports.getTopics = (request, response, next) => {
  selectTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      if (err) next(err);
    });
};

exports.getArticleByID = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleByID(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next)
};

exports.getUsers = (request, response, next) => {
    selectUsers()
    .then((users) => {
        response.status(200).send({ users })
    })
    .catch(next)
}