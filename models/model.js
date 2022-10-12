const db = require("../db/connection")

exports.selectTopics = () => {
return db.query('SELECT * FROM topics').then(({rows : topics}) => {
    return topics
})
};

exports.selectArticleByID = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id]).then(({ rows }) => {
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                message: "Id Not Found"
            })
        } else {
       return rows[0]
        }
    })
};

exports.selectUsers = () => {
    return db.query('SELECT * FROM users').then(({rows : users}) => {
       return users 
    })
}