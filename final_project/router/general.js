const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;
const booksURL = 'https://raw.githubusercontent.com/clumsyjohnny/ibmnodejstests/main/books.json';

public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    if(!isValid(username)){
      users.push({'username':username, 'password':password});
      return res.status(200).json({'message':'user successfully registered, u may login now.'});
    }else{
      res.status(404).json({message:"username duplicated"});  
    }
  }else{
    res.status(404).json({message:"username/password is not provided"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //task -1 get all books
  //res.send(JSON.stringify(books, null, 4));
  //task 10 
  const req1 = axios.get(booksURL);
  req1.then(resp => {
    res.send(JSON.stringify(resp.data, null, 4));
  }).catch(resp=>{
    res.status(404).json({'message':'url not found'});
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  //task 2 - get books based on ISBN
  /*
  if (books[isbn]) {
    res.send(books[isbn]);
  } else {
    res.send("ISBN is not found in the book DATABASE");
  }*/
  const req1 = axios.get(booksURL);
  
  req1.then(resp => {
    
    let booksData = resp.data;
    if (books[isbn]) {
      res.send(books[isbn]);
    } else {
      res.send("ISBN is not found in the book DATABASE");
    }    
  }).catch(resp=>{
    res.status(404).json({'message':'url not found'});
  }); 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //task 3 getting books by author
  let author = req.params.author;
  /*
  let bookList = Object.values(books);
  const findByAuthor = bookList.filter((book) => book.author === author);
  if(findByAuthor.length>0){
    res.send(JSON.stringify(findByAuthor, null, 4));
  }else{
    res.send('book not found');
  }*/
  const req1 = axios.get(booksURL);

  req1.then(resp => {
    
    let booksData = Object.values(resp.data);
    const findByAuthor = booksData.filter((book) => book.author === author);
    if(findByAuthor.length>0){
      res.send(JSON.stringify(findByAuthor, null, 4));
    }else{
      res.send('book not found');
    }   
  }).catch(resp=>{
    res.status(404).json({'message':'url not found'});
  });  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //task 4 getting books by title
  let title = req.params.title;
  /*
  let bookList = Object.values(books);
  console.dir(bookList);
  const findByTitle = bookList.filter((book) => book.title === title);
  if(findByTitle.length>0){
    res.send(JSON.stringify(findByTitle, null, 4));
  }else{
    res.send('book not found');
  }*/
  const req1 = axios.get(booksURL);

  req1.then(resp => {
    
    let booksData = Object.values(resp.data);
    
    const findByTitle = booksData.filter((book) => book.title === title);
   
    if(findByTitle.length>0){
      res.send(JSON.stringify(findByTitle, null, 4));
    }else{
      res.send('book not found');
    }   
  }).catch(resp=>{
    res.status(404).json({'message':'url not found'});
  });  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.send("ISBN is not found in the book DATABASE");
  }
});

module.exports.general = public_users;
