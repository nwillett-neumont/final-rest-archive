import * as logic from "../src/logic.js";
import { JsonDAL } from "../src/jsonDAL.js";
import { removeTestBook } from "./helpers/cleanup.js";

const dal = new JsonDAL();

describe("Logic.updateBook rating boundaries", () => {
  beforeAll(async () => {
    await removeTestBook();
    await logic.createNewBook("test");
    // A rating can only be applied to a book that is being read or finished,
    // so move the test book into the "reading" status first.
    await logic.updateBook("test", "reading", undefined);
  });

  afterAll(async () => {
    await removeTestBook();
  });

  // Boundary Test #1: a rating below 1 must be rejected.
  test("rejects a rating below 1", async () => {
    const result = await logic.updateBook("test", undefined, 0.5);
    expect(result).toBe(-2);
  });

  // Boundary Test #2: a rating above 5 must be rejected.
  test("rejects a rating above 5", async () => {
    const result = await logic.updateBook("test", undefined, 5.5);
    expect(result).toBe(-2);
  });
});

describe("Logic + JsonDAL integration", () => {
  beforeAll(async () => {
    await removeTestBook();
  });

  afterAll(async () => {
    await removeTestBook();
  });

  // Integration Test: the logic module inserts a new "test" book into the
  // database by calling the JsonDAL, and the book can then be read back.
  test("inserts a 'test' book into the database via the DAL", async () => {
    const result = await logic.createNewBook("test");
    expect(result).toBe(0);

    const stored = await dal.findBookByTitle("test");
    expect(stored).toEqual({ title: "test", status: "wantToRead", rating: 0 });
  });
});
