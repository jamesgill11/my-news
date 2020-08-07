const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  afterAll(() => connection.destroy());
  describe("/topics", () => {
    test("GET: 200 respond with a array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              }),
            ])
          );
        });
    });
    test("GET: 200 respond with the correct length of the topics array", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).toBe(3);
        });
    });
    test("INVALID METHODS: 405 responds error, invalid method", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const methodPromise = invalidMethods.map((method) => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).toBe("method not allowed");
          });
      });
      return Promise.all(methodPromise);
    });
  });
  describe("/users", () => {
    test("GET: 200 responds with an array of user details from the username", () => {
      return request(app)
        .get("/api/users/rogersop")
        .expect(200)
        .then((res) => {
          expect(res.body.user).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              }),
            ])
          );
        });
    });
    test("GET: 404 responds with user not found", () => {
      return request(app)
        .get("/api/users/notAUser")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("user not found!");
        });
    });
  });
  describe("/articles", () => {
    test("GET: 200 responds with an article by article id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                article_id: expect.any(Number),
                votes: expect.any(Number),
                title: expect.any(String),
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                author: expect.any(String),
              }),
            ])
          );
        });
    });
    test("GET: 200 returns a comment_count for each article", () => {
      return request(app)
        .get("/api/articles/1")
        .then(({ body: { articles } }) => {
          expect(articles[0].comment_count).toBe(13);
        });
    });
    test("GET: 404 responds with article not found", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("article not found!");
        });
    });
    test("GET: 400 for invalid article input", () => {
      return request(app)
        .get("/api/articles/notAnId")
        .expect(400)
        .then(({ body }) => {
          console.log(body);
          expect(body.msg).toBe("invalid input");
        });
    });
    test("PATCH: 200 responds with new Votes key which indicates what the votes is to be updated by", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then((res) => {
          expect(res.body.article.votes).toBe(101);
        });
    });
    test("PATCH: 400 responds with an error if the inc_votes returns not an integer", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: {} })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request!");
        });
    });
    test("POST: 201 posts an article comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge",
          body: "i am awesome",
        })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                comment_id: expect.any(Number),
                author: expect.any(String),
                article_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                body: expect.any(String),
              }),
            ])
          );
        });
    });
    test("404 ERROR for invalid username", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "james", body: "i am awesome" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid user");
        });
    });
    test("GET: 200 comments by a given article Id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                body: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
              }),
            ])
          );
        });
    });
    // test("404 if comments.article_id is an invalid input", () => {
    //   return request(app)
    //     .get("/api/articles/30/comments")
    //     .expect(404)
    //     .then(({ body }) => {
    //       expect(body.msg).toBe("unknown article id");
    //     });
    // });
    test("GET: 200 sorts the comments by article id by author, defaults to created_at", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=author")
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toBeSortedBy("author", {
            descending: true,
          });
        });
    });
    test("404 error responds with for an invalid query", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=34455")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request!");
        });
    });
    test("GET: 200 can take a query that sorts by votes", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=votes")
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toBeSortedBy("votes", { descending: true });
        });
    });
    test("GET: 200 can take an order by query and returns in ascending order", () => {
      return request(app)
        .get("/api/articles/1/comments?order=asc")
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toBeSortedBy("created_at");
        });
    });
    test("GET 200 sends all articles with a comment count", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article.hasOwnProperty("article_id")).toBe(true);
            expect(article.hasOwnProperty("title")).toBe(true);
            expect(article.hasOwnProperty("body")).toBe(true);
            expect(article.hasOwnProperty("votes")).toBe(true);
            expect(article.hasOwnProperty("topic")).toBe(true);
            expect(article.hasOwnProperty("created_at")).toBe(true);
          });
        });
    });

    test("GET 200 takes a query on articles and sorts by title, defaults to data", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("title", { descending: true });
        });
    });
    test("GET 200 can take an order by query and returns in ascending order", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("created_at");
        });
    });
    test("GET 200 filters the result so only a specific author is shown", () => {
      return request(app)
        .get("/api/articles?author=icellusedkars")
        .expect(200)
        .then((res) => {
          res.body.articles.forEach((article) => {
            expect(article.author).toBe("icellusedkars");
          });
        });
    });
    test("GET 200 filters the result so only a specific topic is shown", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then((res) => {
          res.body.articles.forEach((article) => {
            expect(article.topic).toBe("cats");
          });
        });
    });
  });
  describe("/comments", () => {
    test("PATCH: 200 responds with new Votes key which indicates what the votes is to be updated by", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: -5 })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).toBe(11);
        });
    });
    test("400 invalid ID BAD REQUEST", () => {
      return request(app)
        .patch("/api/comments/notAnId")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request!");
        });
    });
    test("DELETE removes a comment id and responds with a 204", () => {
      return request(app).del("/api/comments/3").expect(204);
    });
    test("DELETE 404 comment_id not found", () => {
      return request(app)
        .del("/api/comments/25")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("comment_id not found");
        });
    });
  });
  describe("ALL: 404: missing routes", () => {
    test("GET: 404 responds with user not found", () => {
      return request(app)
        .get("/api/userssss")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Route not found");
        });
    });
  });
});
