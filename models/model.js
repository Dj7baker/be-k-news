const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows: topics }) => {
    return topics;
  });
};

exports.selectArticles = (topic) => {
  let topicStr = ``;
  let queryValues = [];

  if (topic) {
    topicStr = `WHERE topic = $1`;
    queryValues.push(topic);
  }

  let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id ${topicStr} GROUP BY articles.article_id ORDER BY created_at DESC;`;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (rows.length === 0 && topic) {
      return db
        .query("SELECT * FROM topics WHERE topics.slug = $1", [topic])
        .then((topic) => {
          if (topic.rows.length === 0) {
            return Promise.reject({
              status: 404,
              message: "404: Not Found",
            });
          }
          return rows;
        });
    }
    return rows;
  });
};

exports.selectArticleByID = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id=$1 GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "404: Not Found",
        });
      } else {
        return rows[0];
      }
    });
};

exports.selectComments = (article_id) => {
  return db
    .query(
      `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM comments WHERE comments.article_id=$1 ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

(exports.selectUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows: users }) => {
    return users;
  });
}),
  (exports.updateArticle = (article, article_id) => {
    const { inc_votes } = article;

    return db
      .query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
        [inc_votes, article_id]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({
            status: 404,
            message: "404: Not Found",
          });
        } else {
          return rows[0];
        }
      });
  });
