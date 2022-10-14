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

  let queryStr = `SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id ${topicStr} GROUP BY articles.article_id ORDER BY created_at DESC;`;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: "404: Not Found",
      });
    } else {
      return rows;
    }
  });
};

exports.selectArticleByID = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id])
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
