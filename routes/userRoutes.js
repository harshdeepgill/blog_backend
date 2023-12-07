const express = require("express");
const { UserModel } = require("../model/userModel");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
require('dotenv').config();

const userRouter = express.Router();

userRouter.post("/register", async (req, res)=>{
    const {password} = req.body;
    try {
        bcrypt.hash(password, 5, async(err, hash)=> {
            if(hash){
                req.body.password = hash;
                let user = new UserModel(req.body);
                await user.save();
                res.status(200).send({"msg": "User created successfully!", "user": user});
            }else{
                res.status(500).send({"msg": "Error in hashing ---> "+err});
            }
        });
        
    } catch (err) {
        res.status(500).send({"msg": err})
    }
})
userRouter.post("/login", async (req, res)=>{
    const {password,email} = req.body;

    try {
        const user = await UserModel.findOne({email});
        if(user){
            bcrypt.compare(password, user.password, function(err, result) {
                if(result){
                    var token = jwt.sign({ foo: 'bar' }, process.env.KEY);
                    res.status(200).send({"msg": "Login Successfull!", "token": token})
                }else{
                    res.status(500).send({"msg": "Password did not match!"})
                }
            });
        }else{
            res.status(500).send({"msg": "User not found!"})
        }
    } catch (err) {
        res.status(500).send({"msg": err})
    }
})

module.exports = {userRouter}