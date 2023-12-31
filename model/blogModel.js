const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    username: String,
    title: String,
    content: String,
    category: String,
    date: String,
    likes: Number,
    comments: Array
},
{
    versionKey: false
})

const BlogModel = mongoose.model("blogs", blogSchema);

module.exports = {BlogModel}