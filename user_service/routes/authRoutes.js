const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

require("dotenv").config();

const router = express.Router();

const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '1h'})
}

router.post("/register", async(req, res) => {
    const {username, email, password} = req.body;
    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if(userExists.rows.length > 0){
        return req.status(400).json({message: "Users already exists!!"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUSer = await db.query(
        "INSERT INTO users (username, email, password) VAUES ($1, $2, $3) RETURNING *", 
        [username, email, hashedPassword]
    );

    return res.status(200).json({message: "user created", user: newUSer.rows[0]});
});

router.post("/login", async(req, res) => {
    const {email, password} = req.body;

    const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if(userExists.rows.length === 0){
        return req.status(404).json({message: "User not found!!"});
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if(!validPassword){
        return req.status(400).json({message: "Invalid credentials "});
    }

    const token = generateToken({
        id: user.rows[0].id,
        email: user.rows[0].email
    });

    return res.status(200).json({message: `Login Successful`, token})    

});


router.get("/validate", async(req, res) => {
    const token = req.headers["authorization"];
    
    if(!token){
        return res.status(401).json({message: "Unathorized"});
    }

    try{
        const tokenData = token.split(" ")[1];
        const user = jwt.verify(tokenData, process.env.JWT_SECRET);
        return user.status(200).json({...user});
    }catch(error){
        return req.status(403).json({message: "Invalid token"});
    }
    
});

module.exports = router;
