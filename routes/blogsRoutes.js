const express = require("express");
const { auth } = require("../middleware/authModdleware");
const { BlogModel } = require("../model/blogModel");


const blogRouter = express.Router();


blogRouter.get("/blogs", auth, async (req, res) => {
    const {title, category,sort, order} = req.query;
    if(order == "asc"){
        order = 1;
    }
    if(order == "desc"){
        order = -1;
    }
    try {
        let blogs = await BlogModel.find();
        res.status(200).send({"blogs": blogs});
    } catch (err) {
        res.status(500).send({"msg": err});
    }
})

blogRouter.post("/blogs", auth, async (req,res) => {
    req.body.likes = 0;
    req.body.comments = [];
    req.body.date = new Date;
    try {
        let blog = new BlogModel(req.body);
        await blog.save();
        res.status(200).send({"msg": "Blog added successfully!", "Blog": blog});
    } catch (err) {
        res.status(500).send({"msg": err});
    }
})

blogRouter.patch("/blogs/:id", auth, async (req,res) => {
    const id = req.params.id;
    try {
        let blog = await BlogModel.findOneAndUpdate({_id:id}, req.body)
        res.status(200).send({"msg": "Blog updated successfully!", "Blog": blog});
    } catch (err) {
        res.status(500).send({"msg": err});
    }
})

blogRouter.delete("/blogs/:id", auth, async (req,res) => {
    const id = req.params.id;
    try {
        let blog = await BlogModel.findOneAndDelete({_id:id})
        res.status(200).send({"msg": "Blog deleted successfully!", "Blog": blog});
    } catch (err) {
        res.status(500).send({"msg": err});
    }
})

blogRouter.patch("/blogs/:id/like", auth, async (req,res) => {
    const id = req.params.id;
    try {
        let blog = await BlogModel.findOne({_id:id});
        blog.likes += 1;
        let updatedBlog = await BlogModel.findOneAndUpdate({_id:id}, blog)
        res.status(200).send({"msg": "Like added successfully!", "Blog": updatedBlog});
    } catch (err) {
        res.status(500).send({"msg": err});
    }
})

blogRouter.patch("/blogs/:id/comment", auth, async (req,res) => {
    const id = req.params.id;
    try {
        let blog = await BlogModel.findOne({_id:id});
        blog.comments.push(req.body);
        let updatedBlog = await BlogModel.findOneAndUpdate({_id:id}, blog)
        res.status(200).send({"msg": "Comment added successfully!", "Blog": updatedBlog});
    } catch (err) {
        res.status(500).send({"msg": err});
    }
})

module.exports = {blogRouter}