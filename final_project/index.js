const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const jwtSecret = 'fingerprint_customer';

const app = express();

app.use(express.json());

app.use("/customer",session({secret:jwtSecret,resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authorization){
        let token = req.session.authorization.token;
        jwt.verify(token, 'access', (err, user)=>{
            if(!err){
                req.user = user;
                next();
            }else{
                res.status(400).json({'message':'user not verified'});
            }
        });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
