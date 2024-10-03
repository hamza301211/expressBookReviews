const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

//get book list using async awat
public_users.get("/", async (req, res) => {
  try {
    return res.status(200).send(JSON.stringify(books, null, 4));
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn]);
});

//get book details using promises
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    const bookDetails = books[isbn];
    if (bookDetails) {
      resolve(bookDetails); // Resolve with book data if found
    } else {
      reject("Book not found"); // Reject if the book isn't found
    }
  })
    .then((bookDetails) => {
      // Success: Send book details as JSON
      res.status(200).json(bookDetails);
    })
    .catch((error) => {
      // Error: Send appropriate error message
      if (error === "Book not found") {
        res.status(404).send(error);
      } else {
        res.status(500).send("Internal Server Error");
      }
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  const result = [];
  for (let key in books) {
    if (books[key].author === author) {
      result.push(books[key]);
    }
  }
  if (result.length === 0) {
    return res
      .status(404)
      .send({ message: "No books found for the specified author" });
  }
  return res.status(200).json(result);
});

//get book details using author and promises
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;

  new Promise((resolve, reject) => {
    const bookDetails = books[author];
    if (bookDetails) {
      resolve(bookDetails); // Resolve with book data if found
    } else {
      reject("Book not found"); // Reject if the book isn't found
    }
  })
    .then((bookDetails) => {
      // Success: Send book details as JSON
      res.status(200).json(bookDetails);
    })
    .catch((error) => {
      // Error: Send appropriate error message
      if (error === "Book not found") {
        res.status(404).send(error);
      } else {
        res.status(500).send("Internal Server Error");
      }
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  const result = [];
  for (let key in books) {
    if (books[key].title === title) {
      result.push(books[key]);
    }
  }
  if (result.length === 0) {
    return res
      .status(404)
      .send({ message: "No books found for the specified title" });
  }
  return res.status(200).json(result);
});

//get book details using author and title
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;

  new Promise((resolve, reject) => {
    const bookDetails = books[title];
    if (bookDetails) {
      resolve(bookDetails); // Resolve with book data if found
    } else {
      reject("Book not found"); // Reject if the book isn't found
    }
  })
    .then((bookDetails) => {
      // Success: Send book details as JSON
      res.status(200).json(bookDetails);
    })
    .catch((error) => {
      // Error: Send appropriate error message
      if (error === "Book not found") {
        res.status(404).send(error);
      } else {
        res.status(500).send("Internal Server Error");
      }
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn].reviews);
});

module.exports.general = public_users;
