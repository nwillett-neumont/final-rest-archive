import { test, expect } from "@playwright/test";
import { JsonDAL } from "../src/jsonDAL.js";
import { removeTestBook } from "./helpers/cleanup.js";

const dal = new JsonDAL();

// Start each run from a clean slate so the create call always succeeds, and
// remove the "test" book again afterwards (directly via fs, never the DAL).
test.beforeEach(async () => {
  await removeTestBook();
});

test.afterAll(async () => {
  await removeTestBook();
});

// System Test: create a "test" book through the live API, confirm the returned
// status code, then query the DAL directly to confirm it was persisted.
test("creates a 'test' book via the API and finds it through the DAL", async ({
  request,
}) => {
  const response = await request.post("/new/test");
  expect(response.status()).toBe(201);

  const stored = await dal.findBookByTitle("test");
  expect(stored).toEqual({ title: "test", status: "wantToRead", rating: 0 });
});
