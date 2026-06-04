import express, { Request, Response } from "express";
import * as logic from "./logic.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add a new book. Only POST is accepted on this endpoint.
//   201 created, 409 a book with that title already exists.
app.post("/new/:title", async (req: Request, res: Response) => {
  const title = String(req.params.title);
  const result = await logic.createNewBook(title);
  if (result === -1) {
    res.sendStatus(409);
  } else {
    res.sendStatus(201);
  }
});

// Update a book's status and/or rating via query params. Only PUT is accepted.
//   /update/:title?status={status}&rating={rating}
//   406 nothing to update or an invalid value, 404 book not found, 200 updated.
app.put("/update/:title", async (req: Request, res: Response) => {
  const title = String(req.params.title);
  const status =
    typeof req.query.status === "string" ? req.query.status : undefined;
  const rating =
    req.query.rating !== undefined ? Number(req.query.rating) : undefined;

  // Neither parameter supplied: there is nothing to update.
  if (status === undefined && rating === undefined) {
    res.sendStatus(406);
    return;
  }

  const result = await logic.updateBook(title, status, rating);
  if (result === -1) {
    res.sendStatus(404);
  } else if (result === -2) {
    res.sendStatus(406);
  } else {
    res.sendStatus(200);
  }
});

// Search for a single book by title. Only GET is accepted.
//   404 if no such book, otherwise the book object.
app.get("/search/title/:title", async (req: Request, res: Response) => {
  const title = String(req.params.title);
  const book = await logic.findBookByTitle(title);
  if (Object.keys(book).length === 0) {
    res.sendStatus(404);
  } else {
    res.status(200).json(book);
  }
});

// Search for all books with a given status. Only GET is accepted.
//   404 if none, otherwise the array of books.
app.get("/search/status/:status", async (req: Request, res: Response) => {
  const status = String(req.params.status);
  const books = await logic.findBooksByStatus(status);
  if (books.length === 0) {
    res.sendStatus(404);
  } else {
    res.status(200).json(books);
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});

export default app;
