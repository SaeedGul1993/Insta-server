const express = require('express');
const Router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");
const User = mongoose.model("User");

Router.get("/user/:id", requireLogin, (req, res) => {
    User.findOne({ _id: req.params.id })
        .then(user => {
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")
                .exec((err, post) => {
                    if (err) {
                        return res.status(422).json({ error: err })
                    }
                    res.json({ user, post })
                })
        })
        .catch(err => {
            return res.status(404).json({ error: "User not found" })
        })
})

Router.put("/follow", requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }

        }, { new: true }).select("-password").then(result => {
            console.log(result);
            res.json(result)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })

    }
    )
})

Router.put("/unfollow", requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.unfollowId }

        }, { new: true }).select("-password").then(result => {
            console.log(result);
            res.json(result)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })

    }
    )
})

Router.put("/updatepic", requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        $set: { pic: req.body.pic }
    }, { new: true }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        res.json(result);
    })

})

Router.post("/search-user", requireLogin, (req, res) => {
    let user_pattern = new RegExp("^" + req.body.query);
    User.find({ email: { $regex: user_pattern } })
        .then(user => {
            res.json({ user });
        })
        .catch(err => {
            console.log(err);
        })
})



module.exports = Router;