const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  text: {
    type: String,
    required: true,
  },

  author: {
    type: String,
  },

  img: {
    type: String,
  },
  createdDate: {
    type: Date,
  },
  
  category: {
    type: String,
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
