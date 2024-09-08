const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  
  //write code to check is the username is valid
 
  let userExists = users.filter((user)=>{ return user.username==username;  });
 
  if(userExists.length>0){
    return true;
  }
  return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  console.dir(users);
  var userExists = users.filter((user)=>{ return (user.username==username && user.password==password); });
  if(userExists.length>0)
    return true;
  else
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  console.log(`u: ${username}, p: ${password}`);
  if(!username || !password){
    res.status(404).json({'message':'incomplete username/password'});
  }else{
    if(authenticatedUser(username, password)){
      
      let token = jwt.sign({data:password},'access', {expiresIn: 60*60});
      req.session.authorization = {token, username, password};
      console.dir(req.session.authorization);
      res.status(200).json({'message':'user successfully login'});
    }else{
      res.status(404).json({'message':'incorrect username/password'});
    }
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //You have to give a review as a request query & it must get posted with the username (stored in the session) posted. If the same user posts a different review on the same ISBN, it should modify the existing review. If another user logs in and posts a review on the same ISBN, it will get added as a different review under the same ISBN.
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;
  let review = username+':'+req.body.review;

  if(!books[isbn]){//check if book found
    res.status(404).json({'message':`book with isbn ${isbn} not found`});
  }else{

    let userReviewed = Object.values(books[isbn].reviews);
    if(Object.keys(books[isbn].reviews).length==0){
      books[isbn].reviews = {'0':review};
    }else{
      let newReview = {};
      let modified = false;
      Object.entries(books[isbn].reviews).forEach(([key, value]) => {
          if(value.indexOf(username)==0){
            modified = true;
            newReview[key] = review;
          }else
            newReview[key] = value;
      });
      if(!modified)   
        newReview[Object.keys(newReview).length] = review;
      books[isbn].reviews = newReview;   
    }
    
    return res.status(200).json({message: `Review ${isbn} added by user: ${username}`});
  }
  
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;
  if(!books[isbn]){//check if book found
    res.status(404).json({'message':`book with isbn ${isbn} not found`});
  }else{
    //Filter & delete the reviews based on the session username, so that a user can delete only his/her reviews and not other users’.
    let newReview = {};
    let count = 0;
    let deleted = false;
    console.dir(books[isbn].reviews);
    Object.entries(books[isbn].reviews).forEach(([key, value]) => {
      if(value.indexOf(username)==-1){
        newReview[count++] = books[isbn].reviews;
      }else deleted = true;
    });   
    books[isbn].reviews = newReview; 
    if(deleted)
      return res.status(200).json({message: `Review ${isbn} by user: ${username} deleted`});
    else 
      return res.status(200).json({message: `User: ${username} did not review ${books[isbn].title}`});
  }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
