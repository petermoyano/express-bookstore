process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require('../models/book');

const book = {
    isbn: "0691161518",
    amazon_url: "http://a.co/eobPtX2",
    author: "Matthew Lane",
    language: "english",
    pages: 264,
    publisher: "Princeton University Press",
    title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    year: 2017
};

beforeEach(async () => {
    await db.query('DELETE FROM books');
    await Book.create(book);
})

afterAll(async () => {
    await db.end();
})

describe("GET /", () => {
    test("get all books", async () => {
        const resp = await request(app).get("/books");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(expect.objectContaining({
            books: expect.arrayContaining([
                expect.objectContaining({
                    "isbn": book.isbn,
                    "amazon_url": book.amazon_url,
                    "author": book.author,
                    "language": book.language,
                    "pages": book.pages,
                    "publisher": book.publisher,
                    "title": book.title,
                    "year": book.year
                })
            ])
        }));

    });
    test("GET /:isbn", async () => {
        const resp = await request(app).get(`/books/${book.isbn}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(expect.objectContaining({
            book: expect.objectContaining({
                "isbn": book.isbn,
                "amazon_url": book.amazon_url,
                "author": book.author,
                "language": book.language,
                "pages": book.pages,
                "publisher": book.publisher,
                "title": book.title,
                "year": book.year
            })
        }));

    });
})

describe("POST /", () => {
    test("create a book", async () => {
        const book2 = {
            isbn: "069116151130000",
            amazon_url: "http://a.co/eobPtX2",
            author: "Matthew Lane",
            language: "english",
            pages: 264,
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            year: 2017
        }
        const resp = await request(app).post("/books").send(book2);
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual(expect.objectContaining({
            book: expect.objectContaining({
                "isbn": "069116151130000",
                "amazon_url": book.amazon_url,
                "author": book.author,
                "language": book.language,
                "pages": book.pages,
                "publisher": book.publisher,
                "title": book.title,
                "year": book.year
            })
        }));

    });
})

describe("PUT /:isbn", () => {
    test("update a book", async () => {
        const updateBook = {
            isbn: book.isbn,
            amazon_url: book.amazon_url,
            author: "Pedro Moyano",
            language: book.language,
            pages: book.pages,
            publisher: book.publisher,
            title: book.title,
            year: 2022
        }
        const resp = await request(app).put(`/books/${book.isbn}`).send(updateBook);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(expect.objectContaining({
            book: expect.objectContaining({
                "isbn": book.isbn,
                "amazon_url": book.amazon_url,
                "author": "Pedro Moyano",
                "language": book.language,
                "pages": book.pages,
                "publisher": book.publisher,
                "title": book.title,
                "year": 2022
            })
        }));

    });
});

describe("DELETE /:isbn", () => {
    test("delete a book", async () => {
        const resp = await request(app).delete(`/books/${book.isbn}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(expect.objectContaining({ message: "Book deleted" }));

    });
});