# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Introduction
1. I am a student trying to learn about the principles of software engineering. Part of this is learning how to create an effective project plan, with user stories, acceptance criteria, and tasks.
2. Your sole job is to understand the results of project grooming and create what is necessary to finish this project. Avoid creating tasks that don't exist, and do not create any additional user stories or acceptance criteria.
3. Do not run any commands or install any additional packages. The only thing you are able to do is to create folders, files, and write code.
4. The project is a simple Library management API intended to be called by a user with an API client.
5. The project is implemented in TypeScript
6. This project uses Jest for unit testing and Playwright for API/E2E testing.

## User Stories
As a user, I want to be able to add a book to this software through a REST API.
As a user, I want to be able to update the status of the book I am reading between Want to Read, Currently Reading, and Finished.
As a user, I want to be able to update the rating I give the book as I am reading it, and when I finish it.
As a user, I want to be able to search for books in my library by both title and the status.
As a developer, I don’t think it makes sense that the user can give a book a rating before they have started reading it.
As a developer, I do not want users to be able to have the reading status on more than three books at a time.


## Acceptance Criteria
As a user, I want to be able to add a book to this software through a REST API.
–	GIVEN the user submits a valid post request THEN the book will be persisted in the data base
As a user, I want to be able to update the status of the book I am reading between Want to Read, Currently Reading, and Finished.
–	WHEN the user submits a put request AND the request is updating the status, GIVEN the status is wantToRead, reading, or finished, THEN the book will be updated.
As a user, I want to be able to update the rating I give the book as I am reading it, and when I finish it.
–	WHEN the user submits a put request AND the request is updating the rating, GIVEN the book is either of the status reading or finished, THEN the rating of the book will be updated.
As a user, I want to be able to search for books in my library by both title and the status.
–	WHEN the user submits a get request AND the request is searching by title GIVEN that the book exists it will be returned.
–	WHEN the user submits a get request AND the request is searching by title GIVEN that the book does not exists an empty value will be returned.
–	WHEN the user submits a get request AND the request is searching by status GIVEN that there are books with that status, THEN all books with that status will be returned in an array.
–	WHEN the user submits a get request AND the request is searching by status GIVEN there are no books with that status, THEN an empty array will be returned.
As a developer, I don’t think it makes sense that the user can give a book a rating before they have started reading it.
–	WHEN the user submits a put request AND the request is updating the rating, GIVEN the book is of the status wantToRead, THEN the update will fail.
As a developer, I do not want users to be able to have the reading status on more than three books at a time.
–	WHEN the user submits a put request AND the request is updating the status, GIVEN there are only two or less existing books of the reading status, THEN the book will be updated to reading.
–	WHEN the user submits a put request AND the request is updating the status, GIVEN there are already three or more existing books of the reading status, THEN the status update will fail.

## Tasks
- Create src directory
- Create dist directory
- Create data directory
- Create and use tsconfig that points compiled code to the dist directory and ts files in the src directory
- Create a file called books template that holds the book object structure. Books should have a title string, a status string, and a number for rating.
- Setup server ts in the src directory to use express and create a new express app listening on port 3000
- Make sure server ts is able to use express json and express url encoded
- In server ts, setup listening on endpoints on /new/{title}
- In server ts, setup listening on endpoints on /update/{title}/?status={status}/&rating={rating}
- In server ts, setup listening on endpoints on /search/title/{title}
- In server ts, setup listening on endpoints on /search/status/{status}
- Setup DAL ts as an abstract class that defines the functionality of a DAL (findBookByTitle(title), findBooksByStatus(status), createNewBook(book), updateBook(book))
- Create a jsonDAL that inherits from the abstract DAL and have it implement the methods and write all data to a local ./data/books.json file. The findBook... methods should return an empty array if they are not found. Create should take a title and set the status to wantToRead by default and rating should be zero by default.
- Create logic ts and give it the following methods ( create new book (title), update book (title, status, rating), find book by title, find books by status
- Logic's create new book function should take a given title and then construct a book object with the status "wantToRead" and a rating of 0. The function should check if the title exists in the database, if it does return -1. If it can be created, insert it to the end of the data file and return 0;
- In server's new endpoint, call logics create new book function passing in the title parameter. If it returns -1 return status code 409. If it returns 0 return status code 201.
- Logic's update book should be passed title, status, and rating by the server ts. Since only either status or rating is required to update a book it is possible either of those is undefined, so that should be handled. There can only be one of any title in the flat file data store, so if the update function is called the new data should overwrite the old data completely. The function should also get the data from the data file, if it doesn't exist return -1. We should then check if the updated values adhere to our intended value ranges. The status must be wantToRead, reading, or finished. Any other value should result in -2 being returned. Also, jsonDAL's find books by status function should be called to see how many books currently exist with the reading status. If updating this status would cause that number to be more than three, return -2. We can only have three books being read simultaneously. If the rating is being updated, it has to be within the range 1-5 decimals included. If the value given is out of bounds return -2. Finally, in order for the rating to be updated the book must have the reading or finished status. If it does not return -2. The status should be updated first if both are supplied, so that rating is more likely to be updated. If the data meets the requirements, return 0. At no point should a value be updated if it is of type undefined.
- In Server's update endpoint, the data from the URL will be passed in. If neither parameter is defined return status 406. If one exists call Logic's update function. If it returns -1, return 404. If it returns -2, return status code 406. If it returns 0, return status code 200.
- Logic's find book by title function should search for a book by calling the jsonDAL's find by title function, which returns a book with the same title or an empty book if it doesn't exist. return the book.
- In Server's /search/title/{title} endpoint, the logic's find book by title function should be called. If the book is empty, return 404, otherwise return the book object.
- Logic's find books by status function should call jsonDAL's find books by status function, which should return an array of books. Logics function should return the array.
- In Server's /search/status/{status} endpoint, it should call logics find books by status function. If the array returned is empty return status code 404, otherwise return the book array.
- When Logic calls jsonDAL, it should just be an object called dal so that it can be easily substituted.
- Update package.json to call the necessary file on startup.
- Server should also display a log at what URL and port it is currently listening on. (should be localhost)
- The /search... endpoints should only take get requests.
- The /new endpoint should only take post requests.
- The /update.. endpoint should only take put requests.
- There should be a tests directory that contains tests.
- There should be two unit tests.
	- Unit Test #1: The DAL module is able to return a book object when the title is searched for and the book exists.
	- Unit Test #2: The DAL module returns an empty object if the book can not be found when searched for by title.
- There should be two Boundary tests.
	- Boundary Test #1: Calling the logic module’s update function to make sure it cannot insert values below 1.
	- Boundary Test #2: Calling the logic module’s update function to make sure it cannot insert values above 5.
- There should be one integration test:
- Integration Test:  The logic module can insert a test book (a new book with the title "test") into the database successfully by calling the jsonDAL.
- Playwright should be used for a system test.
- Have Playwright call the API to create a test book, and make sure the returned status code is correct. Then, call the DAL and search for the title “test”.

## Project state

This is an early-stage scaffold for a CSC130 final project: a REST API (`final-rest-archive`).
As of this writing the repository contains only tooling config — there is **no application source
code yet**. The intended entry point is `server.js` (declared as `main` in `package.json`) built on
Express, but that file and any `tsconfig.json` do not exist yet and must be created as the project grows.

Key implications:
- `package.json` `scripts` is empty — there are no `build`, `start`, `lint`, or `test` shortcuts yet.
  Add them as the project takes shape rather than assuming they exist.
- The only real code is `tests/example.spec.ts`, which is the unmodified Playwright starter (it hits
  the public playwright.dev site, not this app). Replace it with tests against the local server.

## Tooling

- **Package manager: pnpm** (pinned to 11.5.1 via `devEngines`). Use `pnpm install`, not npm/yarn —
  the lockfile is `pnpm-lock.yaml`.
- **ES Modules**: `package.json` has `"type": "module"`, so use `import`/`export` and `.js`-style
  module resolution, not CommonJS `require`.
- **Stack**: Express 5, TypeScript 6, `@types/node` 25, Playwright 1.60.

## Commands

```bash
pnpm install                  # install dependencies
pnpm exec playwright test     # run the full Playwright suite (chromium, firefox, webkit)
pnpm exec playwright test tests/example.spec.ts   # run a single test file
pnpm exec playwright test -g "has title"          # run tests matching a title pattern
pnpm exec playwright test --project=chromium      # run one browser project only
pnpm exec playwright show-report                  # open the HTML report after a run
```

## Testing notes

Playwright is configured in `playwright.config.ts`:
- Tests live in `./tests`, run fully in parallel, against chromium/firefox/webkit.
- The `webServer` and `baseURL` blocks are commented out. Once `server.js` exists, uncomment and
  wire them up so tests boot the local Express app and use relative `page.goto('/...')` URLs instead
  of hardcoded external ones.
- CI behavior (retries, single worker, `forbidOnly`) keys off the `CI` env var.
