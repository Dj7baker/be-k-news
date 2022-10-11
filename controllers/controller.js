const { selectTopics } = require("../models/model");

exports.getTopics = (request, response) => {
  selectTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};
