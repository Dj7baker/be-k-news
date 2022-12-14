const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const app = require("../app");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("returns status 200 when successful", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("200: should respond with topic object", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        expect(body.topics).toBeInstanceOf(Array);
        expect(
          body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          })
        );
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: returns an object containing information on the requested article including a comment count with total comments of the article id", () => {
    return request(app)
      .get("/api/articles/7")
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 7,
          title: "Z",
          topic: "mitch",
          author: "icellusedkars",
          body: "I was hungry.",
          created_at: "2020-01-07T14:08:00.000Z",
          votes: 0,
          comment_count: "0",
        });
      });
  });
  test("200: returns an object containing information on the requested article including a comment count with total comments of the article id", () => {
    return request(app)
      .get("/api/articles/1")
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          comment_count: "11",
        });
      });
  });
  test("400: invalid data type", () => {
    return request(app)
      .get("/api/articles/nan")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("400: Bad Request");
      });
  });
  test("404: correct data type but does not exist", () => {
    return request(app)
      .get("/api/articles/7777777")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("404: Not Found");
      });
  });
});

describe("Get /api/users", () => {
  test("returns status 200 when successful", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        expect(body.users).toBeInstanceOf(Array);
        expect(
          body.users.forEach((users) => {
            expect(users).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          })
        );
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("201: responds with updated article", () => {
    const updateAdd = {
      inc_votes: 3,
    };
    return request(app)
      .patch("/api/articles/3")
      .send(updateAdd)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 3,
        });
      });
  });
  test("201: responds with updated article", () => {
    const updateMinus = {
      inc_votes: -3,
    };
    return request(app)
      .patch("/api/articles/3")
      .send(updateMinus)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: -3,
        });
      });
  });
  test("404: correct data type but does not exist", () => {
    const test = {
      inc_votes: 7,
    };
    return request(app)
      .patch("/api/articles/7777")
      .send(test)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("404: Not Found");
      });
  });
  test("400: invalid data type for votes", () => {
    const test = {
      inc_votes: "NaN",
    };
    return request(app)
      .patch("/api/articles/3")
      .send(test)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("400: Bad Request");
      });
  });
});

describe("GET /api/articles", () => {
  test("returns status 200 when successful", () => {
    return request(app).get("/api/articles").expect(200);
  });
  test("200: should respond with an array of articles including a comment count and are sorted by date in decending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(12);
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
        expect(
          body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(String),
              })
            );
          })
        );
      });
  });
  test("200: returns only objects with specified query of topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(1);
        expect(
          body.articles.forEach((article) => {
            expect(article).toEqual(expect.objectContaining({ topic: "cats" }));
          })
        );
      });
  });
  test("200: returns an empty arry when topic query is valid but there are no articles for the topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(0);
        expect(body.articles).toBeInstanceOf(Array);
      });
  });
  test("404: returns an error when passing an invalid topic", () => {
    return request(app)
      .get("/api/articles?topic=wrong")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("404: Not Found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: returns an array of comments for the given article id in order of the most recent comment first", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
        expect(
          body.comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          })
        );
      });
  });
  test("400: invalid data type", () => {
    return request(app)
      .get("/api/articles/nan/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("400: Bad Request");
      });
  });
  test("404: correct data type but does not exist", () => {
    return request(app)
      .get("/api/articles/7777/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("404: Not Found");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with posted comment", () => {
    const toPost = {
      username: "icellusedkars",
      body: "this is a comment",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send({ ...toPost, article_id: 3 })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          })
        );
        delete body.comment.created_at;
        expect(body.comment).toEqual({
          comment_id: 19,
          body: "this is a comment",
          votes: 0,
          author: "icellusedkars",
          article_id: 3,
        });
      });
  });
  test("400: invalid data input or username input", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({ body: "No comment" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("400: Bad Request");
      });
  });
  test("404: correct data type but does not exist", () => {
    return request(app)
      .post("/api/articles/7777/comments")
      .send({
        username: "icellusedkars",
        body: "this is a comment",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("404: Not Found");
      });
  });
});
