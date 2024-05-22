import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const app = express();
const port = 3000;

var sortBy = "none";
var filterBy = "none";
var sortOrder = "ASC";
var authorName = NaN;
var startDate = NaN;
var endDate = NaN;
var books = [];

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "book_notes",
    password: "rrk1234#",
    port: 5432
});

db.connect();
async function applyFilters() {
    try {
        if (sortBy === "none") {
            if (filterBy === "author") {
                var result = await db.query("SELECT * FROM BOOK WHERE AUTHOR = $1", [authorName]);
            } else if (filterBy === "date") {
                var result = await db.query("SELECT * FROM BOOK WHERE DATE_READ BETWEEN $1 AND $2", [startDate, endDate]);
            } else {
                var result = await db.query("SELECT * FROM BOOK");
            }
        } else {
            if (filterBy === "author") {
                var result = await db.query(`SELECT * FROM BOOK WHERE AUTHOR = $1 ORDER BY ${sortBy} ${sortOrder}`, [authorName]);
            } else if (filterBy === "date") {
                var result = await db.query(`SELECT * FROM BOOK WHERE DATE_READ BETWEEN $1 AND $2 ORDER BY ${sortBy} ${sortOrder}`, [startDate, endDate]);
            } else {
                var result = await db.query(`SELECT * FROM BOOK ORDER BY ${sortBy} ${sortOrder}`);
            }
        }
        books = result.rows;
    } catch (err) {
        console.log(err);
    }
}

async function getReview(bookId) {
    var review = NaN;
    try {
        var result = await db.query("SELECT REVIEW FROM REVIEW WHERE BOOK_ID = $1", [bookId]);
        if (result.rows.length > 0) {
            review = result.rows[0].review;
        }
    } catch (err) {
        console.log(err);
    }

    return review;
}

async function getNotes(bookId) {
    try {
        var result = await db.query("SELECT ID, NOTE FROM NOTES WHERE BOOK_ID = $1 ORDER BY ID", [bookId]);
        var notes = result.rows;
        return notes;
    } catch (err) {
        console.log(err);
    }
}

//Middlewares
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//Endpoint handlers
app.get("/", async (req, res) => {
    await applyFilters();
    var reviews = [];
    var review;
    for (var i = 0; i < books.length; i++) {
        review = await getReview(books[i].id);
        reviews.push(review);
    }
    res.render("index.ejs", {
        stylesheet: "index.css",
        books: books,
        reviews: reviews
    });
});

app.get("/add", (req, res) => {
    res.render("add-book.ejs");
});

app.get("/book/:id", async (req, res) => {
    var bookId = parseInt(req.params.id);
    var book = books.find((object) => object.id === bookId);
    var review = await getReview(bookId);
    var notes = await getNotes(bookId);

    res.render("book.ejs", {
        stylesheet: "book.css",
        book: book,
        review: review,
        notes: notes
    })
});

app.post("/add-review", async (req, res) => {
    var review = req.body.review;
    var bookId = parseInt(req.body.bookId);
    try {
        await db.query("INSERT INTO REVIEW(BOOK_ID, REVIEW) VALUES($1, $2)", [bookId, review]);
    } catch (err) {
        console.log(err);
    }
    res.redirect("/book/" + bookId);
});

app.post("/edit-review", async (req, res) => {
    var review = req.body.review;
    var bookId = parseInt(req.body.bookId);
    try {
        await db.query("UPDATE REVIEW SET REVIEW = $1 WHERE BOOK_ID = $2", [review, bookId]);
    } catch (err) {
        console.log(err);
    }
    res.redirect("/book/" + bookId);
})

app.post("/add-note", async (req, res) => {
    var note = req.body.note;
    var bookId = parseInt(req.body.bookId);

    try {
        await db.query("INSERT INTO NOTES(BOOK_ID, NOTE) VALUES($1, $2)", [bookId, note]);
    } catch (err) {
        console.log(err);
    }
    res.redirect("/book/" + bookId);
});

app.post("/edit-note", async (req, res) => {
    var note = req.body.note;
    var noteId = parseInt(req.body.noteId);
    var bookId = parseInt(req.body.bookId);

    try {
        await db.query("UPDATE NOTES SET NOTE = $1 WHERE ID = $2", [note, noteId]);
    } catch (err) {
        console.log(err);
    }
    res.redirect("/book/" + bookId);
})

app.post("/sort", (req, res) => {
    sortBy = req.body.sortBy;
    sortOrder = req.body.order;
    res.redirect("/");
});

app.post("/filter", (req, res) => {
    filterBy = req.body.filterBy;
    if (filterBy === "author") {
        authorName = req.body.author;
    } else if (filterBy === "date") {
        startDate = req.body.startDate;
        endDate = req.body.endDate;
    }
    
    res.redirect("/");
});

app.post("/add",async (req, res) => {
    var title = req.body.title;
    var author = req.body.author;
    var dateRead = req.body.dateRead;
    var rating = parseInt(req.body.rating);

    try {
        await db.query("INSERT INTO BOOK(TITLE, AUTHOR, DATE_READ, RATING) VALUES($1, $2, $3, $4)", [title, author, dateRead, rating]);
    } catch (err) {
        console.log(err)
    }

    res.redirect("/");
})

app.listen(port, () => {
    console.log("Server started on port " + port);
});

