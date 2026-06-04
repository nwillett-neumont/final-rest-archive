import { JsonDAL } from "../src/jsonDAL.js";
import { removeTestBook } from "./helpers/cleanup.js";

const dal = new JsonDAL();

describe("JsonDAL.findBookByTitle", () => {
  beforeAll(async () => {
    await removeTestBook();
    await dal.createNewBook({ title: "test", status: "wantToRead", rating: 0 });
  });

  // Clean up the "test" book once these tests are done.
  afterAll(async () => {
    await removeTestBook();
  });

  // Unit Test #1: the DAL returns a book object when the title exists.
  test("returns the book object when the title is found", async () => {
    const result = await dal.findBookByTitle("test");
    expect(result).toEqual({ title: "test", status: "wantToRead", rating: 0 });
  });

  // Unit Test #2: the DAL returns an empty object when the book is not found.
  test("returns an empty object when the title is not found", async () => {
    const result = await dal.findBookByTitle("does-not-exist");
    expect(result).toEqual({});
  });
});
