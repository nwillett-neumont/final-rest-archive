import { promises as fs } from "fs";
import path from "path";
import { DAL } from "./DAL.js";
import { Book } from "./books.js";

// All data is persisted to a local ./data/books.json file (resolved
// relative to the directory the process is launched from).
const DATA_FILE = path.resolve(process.cwd(), "data", "books.json");

// Concrete DAL that reads/writes the flat JSON file store.
export class JsonDAL extends DAL {
  // Reads the whole store. A missing or empty file is treated as [].
  private async readAll(): Promise<Book[]> {
    try {
      const raw = await fs.readFile(DATA_FILE, "utf-8");
      const trimmed = raw.trim();
      return trimmed ? (JSON.parse(trimmed) as Book[]) : [];
    } catch (err: any) {
      if (err && err.code === "ENOENT") {
        return [];
      }
      throw err;
    }
  }

  // Writes the whole store back to disk, creating ./data if needed.
  private async writeAll(books: Book[]): Promise<void> {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(books, null, 2), "utf-8");
  }

  async findBookByTitle(title: string): Promise<Book | {}> {
    const books = await this.readAll();
    const found = books.find((b) => b.title === title);
    // Return an empty object when the book cannot be found.
    return found ?? {};
  }

  async findBooksByStatus(status: string): Promise<Book[]> {
    const books = await this.readAll();
    // Returns an empty array when there are no matches.
    return books.filter((b) => b.status === status);
  }

  async createNewBook(book: Book): Promise<void> {
    const books = await this.readAll();
    // Default new books to "wantToRead" with a rating of 0.
    const newBook: Book = {
      title: book.title,
      status: book.status ?? "wantToRead",
      rating: book.rating ?? 0,
    };
    books.push(newBook);
    await this.writeAll(books);
  }

  async updateBook(book: Book): Promise<void> {
    const books = await this.readAll();
    const index = books.findIndex((b) => b.title === book.title);
    if (index === -1) {
      books.push(book);
    } else {
      // There is only ever one book per title, so overwrite it completely.
      books[index] = book;
    }
    await this.writeAll(books);
  }
}
