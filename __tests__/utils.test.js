process.env.NODE_ENV = "test";

const {
  formatDates,
  makeRefObj,
  formatComments,
} = require("../db/utils/utils");

describe("formatDates", () => {
  test("takes an array of lists and returns a new array", () => {
    const list = [];
    expect(formatDates(list)).toEqual([]);
  });
  test("takes an array of objects and returns a copies the array and updates the timestamp", () => {
    const list = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    expect(formatDates(list)).toEqual([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100,
      },
    ]);
  });
  test("coverts the unix timestamp for muliple objects", () => {
    const list = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171,
      },
    ];
    const output = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100,
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: new Date(1163852514171),
      },
    ];
    expect(formatDates(list)).toEqual(output);
  });
  test("cheks the new array has not mutated the original array", () => {
    const list = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    expect(formatDates(list)).not.toBe(list);
  });
});

describe("makeRefObj", () => {
  test("takes an array and returns a reference object", () => {
    const input = [];
    expect(makeRefObj(input)).toEqual({});
  });
  test("takes a key for items title and a value of items id for a single row", () => {
    const input = [{ article_id: 1, title: "james" }];
    expect(makeRefObj(input)).toEqual({ james: 1 });
  });
  test("takes multiple key/value pairs and formats them for multiple rows", () => {
    const input = [
      { article_id: 1, title: "james" },
      { article_id: 2, title: "gary" },
      { article_id: 3, title: "laura" },
    ];
    const output = { james: 1, gary: 2, laura: 3 };
    expect(makeRefObj(input)).toEqual({
      james: 1,
      gary: 2,
      laura: 3,
    });
  });
  test("does not mutate the original array", () => {
    const input = [
      { article_id: 1, title: "james" },
      { article_id: 2, title: "gary" },
      { article_id: 3, title: "laura" },
    ];
    const inputCopy = [
      { article_id: 1, title: "james" },
      { article_id: 2, title: "gary" },
      { article_id: 3, title: "laura" },
    ];
    expect(makeRefObj(input)).not.toBe(inputCopy);
  });
});

describe("formatComments", () => {
  test("takes an array and a reference objecvt and outs a new array", () => {
    expect(formatComments([], {})).toEqual([]);
  });
  test("takes the belongs_to, created_by and created_at keys and formats them in the correct way", () => {
    const input = [
      {
        belongs_to: "tea",
        created_by: "james",
        created_at: 1511354163389,
      },
    ];
    const refObj = { tea: 1 };

    expect(formatComments(input, refObj)).toEqual([
      { article_id: 1, author: "james", created_at: new Date(1511354163389) },
    ]);
  });
  test("takes the rest of the properties from the comments section", () => {
    const input = [
      {
        belongs_to: "tea",
        created_by: "james",
        body: "this is about me",
        votes: 0,
        created_at: 1511354163389,
      },
    ];
    const refObj = { tea: 1 };
    expect(formatComments(input, refObj)).toEqual([
      {
        article_id: 1,
        author: "james",
        body: "this is about me",
        votes: 0,
        created_at: new Date(1511354163389),
      },
    ]);
  });
  test("works for multiple data", () => {
    const input = [
      {
        belongs_to: "tea",
        created_by: "james",
        body: "this is about me",
        votes: 5,
        created_at: 1511354163389,
      },
      {
        belongs_to: "rabbit",
        created_by: "gary",
        body: "some stuff",
        votes: 7,
        created_at: 1163852514171,
      },
    ];
    const refObj = { tea: 1, rabbit: 2 };
    expect(formatComments(input, refObj)).toEqual([
      {
        article_id: 1,
        author: "james",
        body: "this is about me",
        votes: 5,
        created_at: new Date(1511354163389),
      },
      {
        article_id: 2,
        author: "gary",
        body: "some stuff",
        votes: 7,
        created_at: new Date(1163852514171),
      },
    ]);
  });
  test("does not mutate the original", () => {
    const input = [
      {
        belongs_to: "tea",
        created_by: "james",
        body: "this is about me",
        votes: 0,
        created_at: 1511354163389,
      },
    ];
    const inputCopy = [
      {
        belongs_to: "tea",
        created_by: "james",
        body: "this is about me",
        votes: 0,
        created_at: 1511354163389,
      },
    ];
    expect(formatComments(input, { tea: 1 })).not.toBe(inputCopy);
  });
});
