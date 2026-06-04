import { Book } from "./books.js";

// Abstract Data Access Layer. Defines the contract that any concrete
// data store (e.g. the JSON file store) must implement. Coding against
// this abstraction lets the storage backend be swapped out easily.
export abstract class DAL {
  // Returns the matching book, or an empty object ({}) if none exists.
  abstract findBookByTitle(title: string): Promise<Book | {}>;

  // Returns every book with the given status, or an empty array if none.
  abstract findBooksByStatus(status: string): Promise<Book[]>;

  // Persists a brand-new book.
  abstract createNewBook(book: Book): Promise<void>;

  // Overwrites an existing book's stored record completely.
  abstract updateBook(book: Book): Promise<void>;
}
