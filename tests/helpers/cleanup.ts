import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.resolve(process.cwd(), "data", "books.json");

// Removes the "test" book directly from the data file.
//
// NOTE: deleting a book is intentionally a *test-only* concern. The DAL has no
// delete capability by design, so this teardown helper operates on the JSON
// store directly via fs rather than going through the DAL or logic layers.
export async function removeTestBook(title = "test"): Promise<void> {
  let books: { title: string }[] = [];
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const trimmed = raw.trim();
    books = trimmed ? JSON.parse(trimmed) : [];
  } catch (err: any) {
    if (err && err.code === "ENOENT") {
      return;
    }
    throw err;
  }

  const filtered = books.filter((b) => b.title !== title);
  await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), "utf-8");
}
