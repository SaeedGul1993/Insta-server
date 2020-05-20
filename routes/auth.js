const express = require('express');
const Router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../Config/key');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

//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
const transport = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: "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"
    }
}))


Router.post("/signup", (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        return res.status(422).json({ error: "Please add the field." })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "user already exits with that email" })
            }
            bcrypt.hash(password, 12)
                .then((hashedPassword) => {
                    const user = new User({
                        name,
                        email,
                        pic,
                        password: hashedPassword
                    })
                    user.save().
                        then((user) => {
                            res.json({ message: "saved successfully" })
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })
        })
        .catch(err => {
            console.log(err);
        })
})

Router.post("/signin", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please add the email and password" });
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid email and password" });
            }
            else {
                bcrypt.compare(password, savedUser.password)
                    .then(doMatch => {
                        if (doMatch) {
                            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                            const { _id, name, email, followers, following, pic } = savedUser;
                            res.json({ token, user: { _id, name, email, followers, following, pic } });
                        }
                        else {
                            return res.status(422).json({ error: "Invalid email and password" });
                        }
                    })
                    .catch(err => {
                        console.log(err);

                    })
            }
        })
        .catch(err => {
            console.log(err);

        })
})

module.exports = Router;