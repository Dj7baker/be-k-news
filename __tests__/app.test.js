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

describe("400", () => {
  test("404: Bad Request - invalid path", () => {
    return request(app)
      .get("/api/invalidpath")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
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
