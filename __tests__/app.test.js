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
  test("200: returns an object containing information on the requested article", () => {
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
      inc_votes : 7
    }
    return request(app)
      .patch("/api/articles/7777")
      .send(test)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("404: Not Found");
      });
  });
  test("400: invalid data type", () => {
    const test = {
      inc_votes: "NaN"
    }
    return request(app)
      .patch("/api/articles/3")
      .send(test)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("400: Bad Request");
      });
    });
});
