const express = require('express');
const Router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");

Router.post("/createpost", requireLogin, (req, res) => {
    const { title, body, pic } = req.body;
    if (!title || !body || !pic) {
        res.status(422).json({ error: "Please add all the fields" })
    }
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        pic,
        postedBy: req.user
    })

    post.save().then(result => {
        res.json({ psot: result })
    })
        .catch(err => {
            console.log(err);

        })
})

Router.get("/allpost", (req, res) => {
    Post.find()
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .sort("-createdAt")
        .then(posts => {
            res.json(posts)
        })
        .catch(err => {
            console.log(err);
        })
})

Router.get("/getsubpost", requireLogin, (req, res) => {
    Post.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .sort("createdAt")
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err);
        })
})

Router.get("/myposts", requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name pic")
        .then(mypost => {
            res.json({ mypost })
        })
        .catch(err => {
            console.log(err);
        })
})

Router.put("/like", requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .exec((err, result) => {
            if (err) {
                return res.json({ error: err })
            }
            else {
                res.json(result)
            }
        })
})

Router.put("/unlike", requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .exec((err, result) => {
            if (err) {
                return res.json({ error: err })
            }
            else {
                res.json(result)
            }
        })
})

Router.put("/comment", requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    }).populate("comments.postedBy", "_id name pic")
        .populate("postedBy", "_id name pic")
        .exec((err, result) => {
            if (err) {
                return res.json({ error: err })
            }
            else {
                res.json(result)
            }
        })
})

Router.delete("/deletepost/:postId", requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err })
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => {
                        res.json(result)
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }

        })
})

Router.put("/deletecomment/", requireLogin, (req, res) => {
    const comment = {
        postedBy: req.user._id,
        text: req.body.text,
        _id: req.body.commentId,
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { comments: comment }
    }, {
        new: true
    }).populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .exec((err, result) => {
            if (err) {
                return res.json({ error: err })
            }
            else {
                res.json(result)
            }
        })
})
module.exports = Router;