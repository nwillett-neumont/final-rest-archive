import { JsonDAL } from "./jsonDAL.js";
import { DAL } from "./DAL.js";
import { Book } from "./books.js";

// The DAL is referenced through a single substitutable object called `dal`.
const dal: DAL = new JsonDAL();

// The only statuses a book is allowed to hold.
const VALID_STATUSES = ["wantToRead", "reading", "finished"];

// A book is "empty" (not found) when the DAL returned {} (no title).
function isEmptyBook(book: Book | {}): boolean {
  return !book || Object.keys(book).length === 0;
}

// Builds a new book (status "wantToRead", rating 0) and inserts it.
// Returns -1 if a book with that title already exists, 0 on success.
export async function createNewBook(title: string): Promise<number> {
  const existing = await dal.findBookByTitle(title);
  if (!isEmptyBook(existing)) {
    return -1;
  }

  const book: Book = { title, status: "wantToRead", rating: 0 };
  await dal.createNewBook(book);
  return 0;
}

// Updates a book's status and/or rating.
//   -1  the book does not exist
//   -2  a supplied value is invalid (bad status, too many books being read,
//       rating out of 1-5 range, or rating set on a not-yet-started book)
//    0  the update succeeded
// Either status or rating may be undefined; an undefined value is never applied.
export async function updateBook(
  title: string,
  status?: string,
  rating?: number
): Promise<number> {
  const existing = await dal.findBookByTitle(title);
  if (isEmptyBook(existing)) {
    return -1;
  }

  const book: Book = { ...(existing as Book) };

  // Apply status first so a rating update can rely on the new status.
  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      return -2;
    }

    // No more than three books may be in the "reading" status at once.
    if (status === "reading") {
      const reading = await dal.findBooksByStatus("reading");
      const alreadyReading = book.status === "reading";
      const projectedCount = reading.length + (alreadyReading ? 0 : 1);
      if (projectedCount > 3) {
        return -2;
      }
    }

    book.status = status;
  }

  if (rating !== undefined) {
    // Rating must be within 1-5 (decimals included).
    if (Number.isNaN(rating) || rating < 1 || rating > 5) {
      return -2;
    }
    // A book can only be rated once it is being read or has been finished.
    if (book.status !== "reading" && book.status !== "finished") {
      return -2;
    }
    book.rating = rating;
  }

  await dal.updateBook(book);
  return 0;
}

// Returns the matching book, or an empty object if it does not exist.
export async function findBookByTitle(title: string): Promise<Book | {}> {
  return dal.findBookByTitle(title);
}

// Returns every book with the given status (empty array if none).
export async function findBooksByStatus(status: string): Promise<Book[]> {
  return dal.findBooksByStatus(status);
}
